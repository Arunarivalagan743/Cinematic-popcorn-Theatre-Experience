import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  responded: { type: Boolean, default: false },
  responseMessage: { type: String, default: null },
  respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  respondedAt: { type: Date, default: null }
}, { timestamps: true });

const contactMessage = mongoose.model('contactMessage', contactMessageSchema);

export default contactMessage;
