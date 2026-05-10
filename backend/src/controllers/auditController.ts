import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAnomalies = async (req: AuthRequest, res: Response) => {
  try {
    const { associationId, status } = req.query;

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

    let query = 'SELECT * FROM anomalies WHERE association_id = $1';
    const params: any[] = [associationId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      anomalies: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Get anomalies error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const runAudit = async (req: AuthRequest, res: Response) => {
  try {
    const { associationId } = req.body;

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

    const recordsResult = await pool.query(
      'SELECT * FROM records WHERE association_id = $1',
      [associationId]
    );

    const records = recordsResult.rows;
    let anomaliesFound = 0;
    let criticalCount = 0;

    for (const record of records) {
      if (record.amount > 100000) {
        const severity = record.amount > 500000 ? 'critical' : 'high';

        await pool.query(
          `INSERT INTO anomalies (association_id, record_id, anomaly_type, severity, description, status) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            associationId,
            record.id,
            'unusual_amount',
            severity,
            `Unusually high amount detected: ${record.amount}`,
            'open',
          ]
        );

        anomaliesFound++;
        if (severity === 'critical') criticalCount++;
      }
    }

    await pool.query(
      `INSERT INTO audit_logs (association_id, audit_type, total_records, anomalies_found, critical_count) VALUES ($1, $2, $3, $4, $5)`,
      [associationId, 'daily', records.length, anomaliesFound, criticalCount]
    );

    res.status(200).json({
      success: true,
      message: 'Audit completed',
      totalRecords: records.length,
      anomaliesFound,
      criticalCount,
    });
  } catch (error) {
    console.error('Run audit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAuditHistory = async (req: AuthRequest, res: Response) => {
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
      'SELECT * FROM audit_logs WHERE association_id = $1 ORDER BY run_at DESC LIMIT 30',
      [associationId]
    );

    res.status(200).json({
      success: true,
      auditHistory: result.rows,
    });
  } catch (error) {
    console.error('Get audit history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateAnomalyStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { anomalyId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const anomalyCheck = await pool.query(
      `SELECT a.* FROM anomalies a JOIN associations assoc ON a.association_id = assoc.id WHERE a.id = $1 AND assoc.user_id = $2`,
      [anomalyId, req.userId]
    );

    if (anomalyCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'UPDATE anomalies SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, anomalyId]
    );

    res.status(200).json({
      success: true,
      message: 'Anomaly status updated',
      anomaly: result.rows[0],
    });
  } catch (error) {
    console.error('Update anomaly error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
