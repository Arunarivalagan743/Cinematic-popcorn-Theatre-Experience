import express from 'express';
const router = express.Router();
import FAQQuestion from '../models/FAQQuestion.js';
import { sendFAQNotification, sendFAQConfirmation } from '../utils/emailService.js';

// Handle preflight requests
router.options('/ask', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Endpoint to submit a FAQ question
router.post('/ask', async (req, res) => {
  try {
    console.log('FAQ request received:', req.body);
    const { userQuestion, userEmail } = req.body;

    // Validate input
    if (!userQuestion || !userEmail) {
      return res.status(400).json({ error: 'Question and email are required' });
    }

    // Save the question to MongoDB
    const newQuestion = new FAQQuestion({ userQuestion, userEmail });
    await newQuestion.save();
    
    console.log('FAQ question saved successfully');

    // Send notification emails (don't wait for email to complete the response)
    Promise.all([
      sendFAQNotification(userQuestion, userEmail),
      sendFAQConfirmation(userEmail)
    ]).then(results => {
      console.log('FAQ emails sent:', results);
    }).catch(error => {
      console.error('Error sending FAQ emails:', error);
      // Don't fail the request if email fails
    });

    res.status(200).json({ message: 'Your question has been submitted successfully! Check your email for confirmation.' });
  } catch (error) {
    console.error('FAQ submission error:', error);
    res.status(500).json({ error: 'Error submitting your question. Please try again.' });
  }
});

export default router;
