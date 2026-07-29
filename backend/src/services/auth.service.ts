import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/pool.js';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = 12;

export class AuthService {
  static async register(email: string, username: string, password: string, referralCode?: string) {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const newReferral = uuidv4().slice(0, 8).toUpperCase();
    let referredBy = null;
    if (referralCode) {
      const ref = await db.query('SELECT id FROM users WHERE referral_code = $1', [referralCode]);
      if (ref.rows.length) referredBy = ref.rows[0].id;
    }
    const result = await db.query(
      `INSERT INTO users (id, email, username, password_hash, referral_code, referred_by, email_verified)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, false)
       RETURNING id, email, username, balance, role`,
      [email, username, hashed, newReferral, referredBy]
    );
    if (referredBy) {
      await db.query(
        `INSERT INTO referrals (referrer_id, referred_id, earnings) VALUES ($1, $2, 0)`,
        [referredBy, result.rows[0].id]
      );
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await db.query(
      'INSERT INTO email_verifications (user_id, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'15 minutes\')',
      [result.rows[0].id, code]
    );
    await this.sendVerificationEmail(email, code);
    return result.rows[0];
  }

  static async verifyEmail(userId: string, code: string) {
    const res = await db.query(
      'SELECT * FROM email_verifications WHERE user_id = $1 AND code = $2 AND expires_at > NOW()',
      [userId, code]
    );
    if (!res.rows.length) throw new Error('Invalid or expired code');
    await db.query('UPDATE users SET email_verified = true WHERE id = $1', [userId]);
    await db.query('DELETE FROM email_verifications WHERE user_id = $1', [userId]);
    return { success: true };
  }

  static async login(email: string, password: string) {
    const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = res.rows[0];
    if (!user) throw new Error('Invalid credentials');
    if (!user.email_verified) throw new Error('Please verify your email first');
    if (user.status === 'banned') throw new Error('Account banned');
    if (user.status === 'suspended') throw new Error('Account suspended');
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error('Invalid credentials');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        balance: user.balance,
        role: user.role,
        status: user.status,
      }
    };
  }

  static async forgotPassword(email: string) {
    const user = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!user.rows.length) throw new Error('Email not found');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await db.query(
      'INSERT INTO password_resets (user_id, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'15 minutes\')',
      [user.rows[0].id, code]
    );
    await this.sendPasswordResetEmail(email, code);
    return { success: true };
  }

  static async resetPassword(email: string, code: string, newPassword: string) {
    const user = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!user.rows.length) throw new Error('Email not found');
    const res = await db.query(
      'SELECT * FROM password_resets WHERE user_id = $1 AND code = $2 AND expires_at > NOW()',
      [user.rows[0].id, code]
    );
    if (!res.rows.length) throw new Error('Invalid or expired code');
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, user.rows[0].id]);
    await db.query('DELETE FROM password_resets WHERE user_id = $1', [user.rows[0].id]);
    return { success: true };
  }

  private static async sendVerificationEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: "zdfkciaqtunvqmbg",
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your Mega Socials account',
      html: `<h1>Verify your email</h1><p>Your verification code is: <strong>${code}</strong></p>`,
    });
  }

  private static async sendPasswordResetEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: "zdfkciaqtunvqmbg",
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Reset your Mega Socials password',
      html: `<h1>Reset your password</h1><p>Your password reset code is: <strong>${code}</strong></p>`,
    });
  }
}
