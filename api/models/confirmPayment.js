import mongoose from 'mongoose';

const confirmPaymentSchema = new mongoose.Schema({
  movie: { type: String, required: true },
  screen: { type: String, required: true },
  timing: { type: String, required: true },
  seats: [{ type: String, required: true }],
  totalCost: { type: Number, required: true },
  parkingDetails: {
    parkingType: { type: String },
    selectedSlot: { type: String },
    phone: { type: String },
    vehicleNumber: { type: String }
  },
  paymentStatus: { type: String, required: true }  // 'confirmed' or 'pending'
});

// Check if the model is already defined to prevent overwriting
const ConfirmPayment = mongoose.models.ConfirmPayment || mongoose.model('ConfirmPayment', confirmPaymentSchema);

export default ConfirmPayment;
