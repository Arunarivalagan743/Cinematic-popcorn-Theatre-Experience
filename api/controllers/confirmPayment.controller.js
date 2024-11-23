import Booking from '../models/confirmPayment.js';  // Correct import
// Import your Booking model

export const confirmPayment = async (req, res) => {
    try {
        const { bookingData } = req.body;

        // Create a new booking document and save it to the database
        const newBooking = new Booking({
            movie: bookingData.movie,
            screen: bookingData.screen,
            timing: bookingData.timing,
            seats: bookingData.seats,
            totalCost: bookingData.totalCost,
            parkingDetails: bookingData.parkingDetails,
            paymentStatus: 'confirmed'  // Set payment status to confirmed
        });

        // Save the booking to MongoDB
        await newBooking.save();

        console.log('Payment confirmed for:', bookingData);

        res.status(200).json({
            success: true,
            message: 'Payment confirmed successfully!',
        });
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while confirming payment.',
        });
    }
};
