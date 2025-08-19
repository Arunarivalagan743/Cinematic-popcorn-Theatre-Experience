import mongoose from 'mongoose';

const faqQuestionSchema = new mongoose.Schema({
  userQuestion: { type: String, required: true },
  userEmail: { type: String, required: true },
  answered: { type: Boolean, default: false },
  adminAnswer: { type: String, default: null },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  answeredAt: { type: Date, default: null },
  category: { type: String, default: 'general' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true });

const FAQQuestion = mongoose.model('FAQQuestion', faqQuestionSchema);


export default FAQQuestion;
