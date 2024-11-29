import express from 'express';
const router = express.Router();
import FAQQuestion from '../models/FAQQuestion.js';


// Endpoint to submit a FAQ question
router.post('/ask', async (req, res) => {
  try {
    const { userQuestion, userEmail } = req.body;

    // Save the question to MongoDB
    const newQuestion = new FAQQuestion({ userQuestion, userEmail });
    await newQuestion.save();

    res.status(200).json({ message: 'Your question has been submitted!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error submitting your question. Please try again.' });
  }
});

export default router;
