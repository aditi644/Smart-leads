import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth';
import { createLeadValidator, updateLeadValidator } from '../validators/lead.validator';
import { handleValidation } from '../middleware/validate';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/stats', getLeadStats);
router.get('/export/csv', exportLeadsCSV);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', createLeadValidator, handleValidation, createLead);
router.patch('/:id', updateLeadValidator, handleValidation, updateLead);
router.delete('/:id', deleteLead);

export default router;
