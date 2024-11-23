import express from 'express';
import { confirmPayment } from '../controllers/confirmPayment.controller.js';  // Correct case-sensitive path


const router = express.Router();

// Define POST route for confirming payment
router.post('/confirm-payment', confirmPayment);

// Export the router as the default export
export default router;
