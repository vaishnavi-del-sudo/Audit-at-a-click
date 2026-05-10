import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { associationId } = req.query;

    if (!associationId) {
      return res.status(400).json({ error: 'Association ID required' });
    }

    const assocCheck = await pool.query(
      'SELECT * FROM associations WHERE id = $1 AND user_id = $2',
      [associationId, req.userId]
    );

    if (assocCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'SELECT * FROM records WHERE association_id = $1 ORDER BY date DESC',
      [associationId]
    );

    res.status(200).json({
      success: true,
      records: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { associationId, description, category, vendorEmployee, amount, date } = req.body;

    if (!associationId || !description || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const assocCheck = await pool.query(
      'SELECT * FROM associations WHERE id = $1 AND user_id = $2',
      [associationId, req.userId]
    );

    if (assocCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'INSERT INTO records (association_id, description, category, vendor_employee, amount, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [associationId, description, category, vendorEmployee, amount, date]
    );

    res.status(201).json({
      success: true,
      message: 'Record created',
      record: result.rows[0],
    });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { recordId } = req.params;
    const { description, category, vendorEmployee, amount, date } = req.body;

    const recordCheck = await pool.query(
      `SELECT r.* FROM records r JOIN associations a ON r.association_id = a.id WHERE r.id = $1 AND a.user_id = $2`,
      [recordId, req.userId]
    );

    if (recordCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'UPDATE records SET description = COALESCE($1, description), category = COALESCE($2, category), vendor_employee = COALESCE($3, vendor_employee), amount = COALESCE($4, amount), date = COALESCE($5, date), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [description, category, vendorEmployee, amount, date, recordId]
    );

    res.status(200).json({
      success: true,
      message: 'Record updated',
      record: result.rows[0],
    });
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { recordId } = req.params;

    const recordCheck = await pool.query(
      `SELECT r.* FROM records r JOIN associations a ON r.association_id = a.id WHERE r.id = $1 AND a.user_id = $2`,
      [recordId, req.userId]
    );

    if (recordCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM records WHERE id = $1', [recordId]);

    res.status(200).json({
      success: true,
      message: 'Record deleted',
    });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
