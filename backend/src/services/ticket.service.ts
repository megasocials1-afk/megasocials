import { query } from '../db/pool.js';
import { v4 as uuidv4 } from 'uuid';

export class TicketService {
  static async createTicket(userId: string, subject: string, message: string, priority: string = 'medium') {
    const result = await query(
      `INSERT INTO tickets (id, user_id, subject, message, priority, status)
       VALUES ($1, $2, $3, $4, $5, 'open') RETURNING *`,
      [uuidv4(), userId, subject, message, priority]
    );
    return result.rows[0];
  }

  static async getUserTickets(userId: string) {
    const result = await query('SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  static async getTicket(ticketId: string, userId: string) {
    const result = await query('SELECT * FROM tickets WHERE id = $1 AND user_id = $2', [ticketId, userId]);
    return result.rows[0] || null;
  }

  static async addReply(ticketId: string, userId: string, message: string, isAdmin: boolean = false) {
    const result = await query(
      `INSERT INTO ticket_replies (id, ticket_id, user_id, message, is_admin)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [uuidv4(), ticketId, userId, message, isAdmin]
    );
    return result.rows[0];
  }

  static async getAllTickets() {
    const result = await query('SELECT * FROM tickets ORDER BY created_at DESC');
    return result.rows;
  }

  static async updateStatus(ticketId: string, status: string) {
    await query('UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2', [status, ticketId]);
    return { success: true };
  }
}
