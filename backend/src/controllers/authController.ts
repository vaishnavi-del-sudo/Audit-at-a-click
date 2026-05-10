import { Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { AuthRequest, generateToken } from '../middleware/auth';

export const signup = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, associationName, associationType, auditCategory, systemPlacement } = req.body;

    if (!email || !password || !name || !associationName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    const userId = userResult.rows[0].id;

    const associationResult = await pool.query(
      'INSERT INTO associations (user_id, name, type, audit_category, system_placement) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, associationName, associationType, auditCategory, systemPlacement]
    );

    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: 'Account provisioned successfully',
      token,
      user: {
        id: userId,
        email: userResult.rows[0].email,
        name: userResult.rows[0].name,
      },
      association: associationResult.rows[0],
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const associationResult = await pool.query(
      'SELECT * FROM associations WHERE user_id = $1 LIMIT 1',
      [user.id]
    );

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      association: associationResult.rows[0] || null,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userResult = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [req.userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const associationResult = await pool.query(
      'SELECT * FROM associations WHERE user_id = $1 LIMIT 1',
      [req.userId]
    );

    res.status(200).json({
      user: userResult.rows[0],
      association: associationResult.rows[0] || null,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
