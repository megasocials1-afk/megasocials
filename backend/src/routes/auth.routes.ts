import { AuthService } from '../services/auth.service.js';

export default {
  login: async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  },
  register: async (req: any, res: any) => {
    try {
      const { email, username, password, referralCode } = req.body;
      const user = await AuthService.register(email, username, password, referralCode);
      res.json({ success: true, user, message: 'Verification code sent to your email' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  forgotPassword: async (req: any, res: any) => {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      res.json({ success: true, message: 'Reset code sent to your email' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  resetPassword: async (req: any, res: any) => {
    try {
      const { email, code, newPassword } = req.body;
      await AuthService.resetPassword(email, code, newPassword);
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  verifyEmail: async (req: any, res: any) => {
    try {
      const { userId, code } = req.body;
      await AuthService.verifyEmail(userId, code);
      res.json({ success: true, message: 'Email verified successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
