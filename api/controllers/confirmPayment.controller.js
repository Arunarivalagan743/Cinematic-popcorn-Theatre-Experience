
import Booking from '../models/confirmPayment.js';
import nodemailer from 'nodemailer';

// Configure your email service directly (example uses Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'harishmkr88@gmail.com',      // Replace with your email address
    pass: 'hlkr znlr gexc xhqh', // Replace with your email password
  },
});

// Function to send an email notification
const sendEmailNotification = async (recipientEmail, bookingData) => {
  try {
    // Email content
    const mailOptions = {
      from: 'harishmkr88@gmail.com', // Replace with your email address
      to: bookingData.userEmail,
      subject: 'Payment Confirmation - Your Booking Details',
      text: `Hello,
Your payment has been confirmed successfully. Here are your booking details:

Movie: ${bookingData.movie}
Screen: ${bookingData.screen}
Timing: ${bookingData.timing}
Seats: ${bookingData.seats.join(', ')}
Parking Type: ${bookingData.parkingDetails ? bookingData.parkingDetails.parkingType : 'N/A'}
Selected Slot: ${bookingData.parkingDetails ? bookingData.parkingDetails.selectedSlot : 'N/A'}
Total Amount Paid: $${bookingData.totalCost}

Thank you for booking with us!

Regards,
Your Cinema Team`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', recipientEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { bookingData } = req.body;

    
    const newBooking = new Booking({
      movie: bookingData.movie,
      screen: bookingData.screen,
      timing: bookingData.timing,
      seats: bookingData.seats,
      totalCost: bookingData.totalCost,
      currentUser: bookingData.userEmail, // Store the current user's email
      parkingDetails: bookingData.parkingDetails,
      paymentStatus: 'confirmed',  // Set payment status to confirmed
    });

    // Save the booking to MongoDB
    await newBooking.save();

    // Send an email notification to the user after successful payment
    await sendEmailNotification(bookingData.userEmail, bookingData);

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
