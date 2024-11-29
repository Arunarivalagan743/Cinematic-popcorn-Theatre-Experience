import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const contactMessage = mongoose.model('contactMessage', contactMessageSchema);

export default contactMessage;
