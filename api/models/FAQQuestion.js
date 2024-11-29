import mongoose from 'mongoose';

const faqQuestionSchema = new mongoose.Schema({
  userQuestion: { type: String, required: true },
  userEmail: { type: String, required: true },
}, { timestamps: true });

const FAQQuestion = mongoose.model('FAQQuestion', faqQuestionSchema);


export default FAQQuestion;
