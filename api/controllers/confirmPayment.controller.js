
import Booking from '../models/confirmPayment.js';
import nodemailer from 'nodemailer';

// Configure email service directly (example uses Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'harishmkr88@gmail.com',  // Replace with your email address
    pass: 'hlkr znlr gexc xhqh',   // Replace with your app password
  },
});

// Function to calculate parking cost
const calculateParkingCost = (parkingDetails) => {
  const parkingCostPerVehicle = 5; // Set the cost per vehicle
  let totalParkingCost = 0;

  if (parkingDetails) {
    if (parkingDetails.vehicleNumbers) {
      if (parkingDetails.vehicleNumbers.twoWheeler) {
        totalParkingCost += parkingDetails.vehicleNumbers.twoWheeler.length * parkingCostPerVehicle;
      }
      if (parkingDetails.vehicleNumbers.fourWheeler) {
        totalParkingCost += parkingDetails.vehicleNumbers.fourWheeler.length * parkingCostPerVehicle;
      }
    }
  }

  return totalParkingCost;
};

// Function to send an email notification
const sendEmailNotification = async (recipientEmail, bookingData) => {
  try {
    const parkingCost = calculateParkingCost(bookingData.parkingDetails);
    const totalAmount = bookingData.totalCost + parkingCost; // Add parking cost to total amount

    // Email content with image, modern light color palette, and button with hover effects
    const mailOptions = {
      from:  'harishmkr88@gmail.com',  // Replace with your email address
      to: recipientEmail,
      subject: '🎬 CiniPop - Payment Confirmation - Your Cinematic Booking Details 🍿',
      html: `
        <div style="font-family: 'Helvetica', sans-serif; background-color: #fafafa; color: #333; padding: 30px; border-radius: 15px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #ffcc00; text-align: center; font-size: 35px; animation: fadeIn 2s ease;">🎬 CiniPop Cinematic Popcorn Park - Booking Confirmation 🍿</h2>
          
          <!-- Image with fade-in animation -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-image-url.com/image.jpg" alt="CiniPop Logo" style="width: 300px; height: auto; animation: fadeIn 2s ease;" />
          </div>
          
          <p style="font-size: 18px; line-height: 1.6; text-align: center; font-weight: bold; color: #ff9900;">Your payment has been confirmed successfully! Here are your **Booking Details**:</p>

          <hr style="border: 1px solid #ffcc00;" />
          
          <h3 style="font-size: 22px; color: #ffcc00;">Movie Details:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li><strong>🎥 Movie:</strong> ${bookingData.movie}</li>
            <li><strong>🎞️ Screen:</strong> ${bookingData.screen}</li>
            <li><strong>⏰ Timing:</strong> ${bookingData.timing}</li>
            <li><strong>🎟️ Seats:</strong> ${bookingData.seats.join(', ')}</li>
          </ul>
          
          <h3 style="font-size: 22px; color: #ffcc00;">Parking Details:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li><strong>🏍️ Vehicle Numbers (Two-Wheeler):</strong> ${bookingData.parkingDetails && bookingData.parkingDetails.vehicleNumbers && bookingData.parkingDetails.vehicleNumbers.twoWheeler ? bookingData.parkingDetails.vehicleNumbers.twoWheeler.join(', ') : 'N/A'}</li>
            <li><strong>🚗 Vehicle Numbers (Four-Wheeler):</strong> ${bookingData.parkingDetails && bookingData.parkingDetails.vehicleNumbers && bookingData.parkingDetails.vehicleNumbers.fourWheeler ? bookingData.parkingDetails.vehicleNumbers.fourWheeler.join(', ') : 'N/A'}</li>
          </ul>

          <h3 style="font-size: 22px; color: #ffcc00;">Cost Breakdown:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li><strong>💰 Parking Cost:</strong> $${parkingCost}</li>
            <li><strong>💳 Total Amount Paid:</strong> $${totalAmount}</li>
          </ul>

          <hr style="border: 1px solid #ffcc00;" />
          
          <p style="font-size: 18px; line-height: 1.6;">Thank you for booking with **CiniPop** – the ultimate cinematic experience! 🍿</p>
          <p style="font-size: 18px; line-height: 1.6; text-align: center;">Looking forward to seeing you at the movies! 🎬</p>

          <!-- Button to go to CiniPop website -->
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://your-cinipop-website.com" style="background-color: #ffcc00; color: #fff; padding: 15px 30px; text-decoration: none; font-size: 18px; border-radius: 10px; transition: background-color 0.3s ease;">
              Visit CiniPop Website
            </a>
          </div>

          <footer style="font-size: 14px; text-align: center; margin-top: 20px; color: #ffcc00; padding-top: 10px;">
            <p>&copy; 2024 CiniPop. All Rights Reserved.</p>
          </footer>
        </div>

        <style>
          /* Animation for fade-in */
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          /* Hover effect for links */
          a:hover {
            color: #ffcc00;
            text-decoration: underline;
            transition: all 0.3s ease-in-out;
          }
          
          /* Hover effect for button */
          a:hover {
            background-color: #e6a700;
            transition: background-color 0.3s ease;
          }
          
          /* Hover effect for container */
          div:hover {
            background-color: #f1f1f1;
            box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
        </style>
      `,
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

    // Validate the required fields
    if (!bookingData.movie || !bookingData.screen || !bookingData.timing || !bookingData.seats || !bookingData.totalCost || !bookingData.userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking details.',
      });
    }

    // Create new booking record
    const newBooking = new Booking({
      movie: bookingData.movie,
      screen: bookingData.screen,
      timing: bookingData.timing,
      seats: bookingData.seats,
      totalCost: bookingData.totalCost,
      currentUser: bookingData.userEmail,  // Store the current user's email
      parkingDetails: bookingData.parkingDetails || {},  // Optional parking details
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
