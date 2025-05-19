import express from 'express';
import { handleAnalysis } from '../controllers/analysisController.js';

const router = express.Router();

// No upload middleware needed
router.post('/', handleAnalysis);

export default router;
