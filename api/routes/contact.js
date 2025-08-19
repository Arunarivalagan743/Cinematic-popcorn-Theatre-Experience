import express from 'express';
const router = express.Router();
import ContactMessage from '../models/contactMessage.js';
import { sendContactNotification, sendContactConfirmation } from '../utils/emailService.js';

// Handle preflight requests
router.options('/submit', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Endpoint to submit a contact message
router.post('/submit', async (req, res) => {
  try {
    console.log('Contact request received:', req.body);
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Save the message to MongoDB
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();
    
    console.log('Contact message saved successfully');

    // Send notification emails (don't wait for email to complete the response)
    Promise.all([
      sendContactNotification(name, email, message),
      sendContactConfirmation(name, email)
    ]).then(results => {
      console.log('Contact emails sent:', results);
    }).catch(error => {
      console.error('Error sending contact emails:', error);
      // Don't fail the request if email fails
    });

    res.status(200).json({ message: 'Message sent successfully! Check your email for confirmation.' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Error submitting your message. Please try again.' });
  }
});
export default router;
