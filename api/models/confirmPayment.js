import mongoose from 'mongoose';


const confirmPaymentSchema = new mongoose.Schema({
  movie: { type: String, required: true },
  screen: { type: String, required: true },
  timing: { type: String, required: true },
  seats: [{ type: String, required: true }],
  totalCost: { type: Number, required: true },
  currentUser: { type: String, required: false },
  parkingDetails: {
    parkingType: { type: String, required: true },
    selectedSlot: { type: Map, of: String, required: true }, // Store as a Map (Object)
    phone: { type: Number, required: true },
    vehicleNumber: { type: String, required: true }
  },
  paymentStatus: { type: String, required: true }  // 'confirmed' or 'pending'
});
const ConfirmPayment = mongoose.models.ConfirmPayment || mongoose.model('ConfirmPayment', confirmPaymentSchema);
export default ConfirmPayment;