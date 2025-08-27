import express from 'express';
import { 
  createPaymentIntent, 
  confirmStripePayment, 
  getPaymentStatus,
  handleStripeWebhook 
} from '../controllers/stripe.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', verifyToken, createPaymentIntent);

// Confirm payment
router.post('/confirm-payment', verifyToken, confirmStripePayment);

// Get payment status
router.get('/payment-status/:paymentIntentId', verifyToken, getPaymentStatus);

// Stripe webhook endpoint (no auth required for webhooks)
router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

export default router;
