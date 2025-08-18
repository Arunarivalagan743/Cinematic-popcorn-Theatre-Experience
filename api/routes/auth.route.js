


import express from 'express';
import { signin, signup, google, signout, refreshToken } from '../controllers/auth.controller.js';
import { sendEmailOTP, verifyEmailOTP } from '../controllers/emailOtp.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);
router.post('/refresh-token', refreshToken);

// Email OTP routes for fallback verification
router.post('/send-email-otp', sendEmailOTP);
router.post('/verify-email-otp', verifyEmailOTP);

export default router;