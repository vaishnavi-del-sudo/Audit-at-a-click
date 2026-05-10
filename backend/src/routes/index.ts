import express from 'express';
import { signup, login, getCurrentUser } from '../controllers/authController';
import { getRecords, createRecord, updateRecord, deleteRecord } from '../controllers/recordsController';
import { getAnomalies, runAudit, getAuditHistory, updateAnomalyStatus } from '../controllers/auditController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getCurrentUser);

router.get('/records', authenticate, getRecords);
router.post('/records', authenticate, createRecord);
router.put('/records/:recordId', authenticate, updateRecord);
router.delete('/records/:recordId', authenticate, deleteRecord);

router.get('/anomalies', authenticate, getAnomalies);
router.post('/audits/run', authenticate, runAudit);
router.get('/audits/history', authenticate, getAuditHistory);
router.put('/anomalies/:anomalyId', authenticate, updateAnomalyStatus);

export default router;
