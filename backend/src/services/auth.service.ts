import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, query } from '../db/pool.js';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { ActivityLogService } from './activity-log.service.js';

const JWT_SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = 12;

export class AuthService {
  static async register(email: string, username: string, password: string, referralCode?: string, ip?: string, userAgent?: string) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const newReferral = uuidv4().slice(0, 8).toUpperCase();
    let referredBy = null;
    if (referralCode) {
      const ref = await query('SELECT id FROM users WHERE referral_code = $1', [referralCode]);
      if (ref.rows.length) referredBy = ref.rows[0].id;
    }
    const result = await query(
      `INSERT INTO users (id, email, username, password_hash, referral_code, referred_by, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, false)
       RETURNING id, email, username, balance, role`,
      [uuidv4(), email, username, hashed, newReferral, referredBy]
    );
    const user = result.rows[0];
    if (referredBy) {
      await query(
        `INSERT INTO referrals (referrer_id, referred_id, earnings) VALUES ($1, $2, 0)`,
        [referredBy, user.id]
      );
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await query(
      'INSERT INTO email_verifications (user_id, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'15 minutes\')',
      [user.id, code]
    );
    console.log('📧 OTP for', email, ':', code);
    await ActivityLogService.log(user.id, 'user_register', { email, username }, ip, userAgent);
    return user;
  }

  static async verifyEmail(userId: string, code: string) {
    const res = await query(
      'SELECT * FROM email_verifications WHERE user_id = $1 AND code = $2 AND expires_at > NOW()',
      [userId, code]
    );
    if (!res.rows.length) throw new Error('Invalid or expired verification code');
    await query('UPDATE users SET email_verified = true WHERE id = $1', [userId]);
    await query('DELETE FROM email_verifications WHERE user_id = $1', [userId]);
    return { success: true };
  }

  static async login(email: string, password: string, ip?: string, userAgent?: string) {
    const res = await query('SELECT * FROM users WHERE email = $1', [email]);
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
    await ActivityLogService.log(user.id, 'user_login', { email }, ip, userAgent);
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

  static async forgotPassword(email: string, ip?: string, userAgent?: string) {
    const user = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (!user.rows.length) throw new Error('Email not found');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await query(
      'INSERT INTO password_resets (user_id, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'15 minutes\')',
      [user.rows[0].id, code]
    );
    console.log('🔑 Reset code for', email, ':', code);
    await ActivityLogService.log(user.rows[0].id, 'user_forgot_password', { email }, ip, userAgent);
    return { success: true };
  }

  static async resetPassword(email: string, code: string, newPassword: string, ip?: string, userAgent?: string) {
    const user = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (!user.rows.length) throw new Error('Email not found');
    const res = await query(
      'SELECT * FROM password_resets WHERE user_id = $1 AND code = $2 AND expires_at > NOW()',
      [user.rows[0].id, code]
    );
    if (!res.rows.length) throw new Error('Invalid or expired reset code');
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, user.rows[0].id]);
    await query('DELETE FROM password_resets WHERE user_id = $1', [user.rows[0].id]);
    await ActivityLogService.log(user.rows[0].id, 'user_reset_password', { email }, ip, userAgent);
    return { success: true };
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const res = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    const user = res.rows[0];
    if (!user) throw new Error('User not found');
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) throw new Error('Current password is incorrect');
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, userId]);
    return { success: true };
  }

  static async getMe(userId: string) {
    const res = await query('SELECT id, email, username, balance, status, role, referral_code FROM users WHERE id = $1', [userId]);
    return res.rows[0];
  }

  static async updateProfile(userId: string, data: { username?: string; email?: string }) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    if (data.username) {
      updates.push(`username = $${paramIndex++}`);
      values.push(data.username);
    }
    if (data.email) {
      updates.push(`email = $${paramIndex++}`);
      values.push(data.email);
    }
    if (!updates.length) throw new Error('No fields to update');
    values.push(userId);
    await query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex}`,
      values
    );
    return { success: true };
  }
}
