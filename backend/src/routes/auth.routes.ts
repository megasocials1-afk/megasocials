import { AuthService } from '../services/auth.service.js';

export default {
  login: async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password, req.ip, req.headers['user-agent']);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  },
  register: async (req: any, res: any) => {
    try {
      const { email, username, password, referralCode } = req.body;
      const user = await AuthService.register(email, username, password, referralCode, req.ip, req.headers['user-agent']);
      res.json({ success: true, user, message: 'Verification code sent to your email' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  forgotPassword: async (req: any, res: any) => {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email, req.ip, req.headers['user-agent']);
      res.json({ success: true, message: 'Reset code sent to your email' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  resetPassword: async (req: any, res: any) => {
    try {
      const { email, code, newPassword } = req.body;
      await AuthService.resetPassword(email, code, newPassword, req.ip, req.headers['user-agent']);
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
  },
  me: async (req: any, res: any) => {
    try {
      const user = await AuthService.getMe(req.user.id);
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  changePassword: async (req: any, res: any) => {
    try {
      const { oldPassword, newPassword } = req.body;
      await AuthService.changePassword(req.user.id, oldPassword, newPassword);
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  updateProfile: async (req: any, res: any) => {
    try {
      const { username, email } = req.body;
      await AuthService.updateProfile(req.user.id, { username, email });
      res.json({ success: true, message: 'Profile updated successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
