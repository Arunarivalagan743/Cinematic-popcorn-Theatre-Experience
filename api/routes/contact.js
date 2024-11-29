import express from 'express';
const router = express.Router();
import ContactMessage from '../models/contactMessage.js';
 // Ensure the name and path are correct



// Endpoint to submit a contact message
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save the message to MongoDB
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error submitting your message. Please try again.' });
  }
});
export default router;
