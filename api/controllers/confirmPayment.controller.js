
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

    // Email content with luxury cinematic brand styling
    const mailOptions = {
      from:  'harishmkr88@gmail.com',  // Replace with your email address
      to: recipientEmail,
      subject: ' Cinematic Popcorn Park - Luxury Booking Confirmation 🍿',
      html: `
        <div style="font-family: 'Playfair Display', 'Times New Roman', serif; background-color: #0D0D0D; color: #F5F5F5; padding: 30px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5); border: 1px solid rgba(200, 169, 81, 0.3);">
          <h2 style="color: #C8A951; text-align: center; font-size: 35px; animation: fadeIn 2s ease; text-shadow: 0 0 10px rgba(200, 169, 81, 0.3);">🎬 Cinematic Popcorn Park - Luxury Booking Confirmation 🍿</h2>
          
          <!-- Image with fade-in animation -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-image-url.com/image.jpg" alt="Cinematic Popcorn Park Logo" style="width: 300px; height: auto; animation: fadeIn 2s ease; border: 1px solid rgba(200, 169, 81, 0.3);" />
          </div>
          
          <p style="font-family: 'Poppins', 'Arial', sans-serif; font-size: 18px; line-height: 1.6; text-align: center; font-weight: bold; color: #C8A951; text-shadow: 0 0 5px rgba(200, 169, 81, 0.2);">Your payment has been confirmed successfully! Here are your <strong>Booking Details</strong>:</p>

          <hr style="border: 1px solid rgba(200, 169, 81, 0.5);" />
          
          <h3 style="font-family: 'Cinzel', serif; font-size: 22px; color: #C8A951; margin-top: 25px; margin-bottom: 15px; text-shadow: 0 0 8px rgba(200, 169, 81, 0.2);">Movie Details</h3>
          <div style="background-color: #141414; padding: 15px; border-left: 2px solid #C8A951;">
            <ul style="list-style-type: none; padding-left: 0; font-family: 'Poppins', 'Arial', sans-serif;">
              <li style="padding: 8px 0;"><strong style="color: #C8A951; display: inline-block; width: 80px;">Movie:</strong> <span style="color: #F5F5F5;">${bookingData.movie}</span></li>
              <li style="padding: 8px 0; border-top: 1px solid rgba(200, 169, 81, 0.1);"><strong style="color: #C8A951; display: inline-block; width: 80px;">Screen:</strong> <span style="color: #F5F5F5;">${bookingData.screen}</span></li>
              <li style="padding: 8px 0; border-top: 1px solid rgba(200, 169, 81, 0.1);"><strong style="color: #C8A951; display: inline-block; width: 80px;">Timing:</strong> <span style="color: #F5F5F5;">${bookingData.timing}</span></li>
              <li style="padding: 8px 0; border-top: 1px solid rgba(200, 169, 81, 0.1);"><strong style="color: #C8A951; display: inline-block; width: 80px;">Seats:</strong> <span style="color: #F5F5F5;">${bookingData.seats.join(', ')}</span></li>
            </ul>
          </div>
          
          <h3 style="font-family: 'Cinzel', serif; font-size: 22px; color: #C8A951; margin-top: 25px; margin-bottom: 15px; text-shadow: 0 0 8px rgba(200, 169, 81, 0.2);">Parking Details</h3>
          <div style="background-color: #141414; padding: 15px; border-left: 2px solid #C8A951;">
            <ul style="list-style-type: none; padding-left: 0; font-family: 'Poppins', 'Arial', sans-serif;">
              <li style="padding: 8px 0;"><strong style="color: #C8A951;">Two-Wheeler:</strong> <span style="color: #F5F5F5;">${bookingData.parkingDetails && bookingData.parkingDetails.vehicleNumbers && bookingData.parkingDetails.vehicleNumbers.twoWheeler ? bookingData.parkingDetails.vehicleNumbers.twoWheeler.join(', ') : 'N/A'}</span></li>
              <li style="padding: 8px 0; border-top: 1px solid rgba(200, 169, 81, 0.1);"><strong style="color: #C8A951;">Four-Wheeler:</strong> <span style="color: #F5F5F5;">${bookingData.parkingDetails && bookingData.parkingDetails.vehicleNumbers && bookingData.parkingDetails.vehicleNumbers.fourWheeler ? bookingData.parkingDetails.vehicleNumbers.fourWheeler.join(', ') : 'N/A'}</span></li>
            </ul>
          </div>

          <h3 style="font-family: 'Cinzel', serif; font-size: 22px; color: #C8A951; margin-top: 25px; margin-bottom: 15px; text-shadow: 0 0 8px rgba(200, 169, 81, 0.2);">Cost Breakdown</h3>
          <div style="background-color: #141414; padding: 15px; border-left: 2px solid #C8A951;">
            <ul style="list-style-type: none; padding-left: 0; font-family: 'Poppins', 'Arial', sans-serif;">
              <li style="padding: 8px 0;"><strong style="color: #C8A951; display: inline-block; width: 150px;">Parking Cost:</strong> <span style="color: #F5F5F5;">₹${parkingCost}</span></li>
              <li style="padding: 8px 0; border-top: 1px solid rgba(200, 169, 81, 0.1);"><strong style="color: #C8A951; display: inline-block; width: 150px;">Total Amount Paid:</strong> <span style="color: #F5F5F5; font-weight: bold;">₹${totalAmount}</span></li>
            </ul>
          </div>

          <hr style="border: 1px solid rgba(200, 169, 81, 0.5); margin-top: 30px; margin-bottom: 30px;" />
          
          <p style="font-family: 'Playfair Display', serif; font-size: 20px; line-height: 1.6; text-align: center; color: #C8A951; text-shadow: 0 0 5px rgba(200, 169, 81, 0.2);">Thank you for booking with <strong>Cinematic Popcorn Park</strong> – the ultimate luxury cinema experience! 🍿</p>
          <p style="font-family: 'Poppins', sans-serif; font-size: 18px; line-height: 1.6; text-align: center; color: #F5F5F5; margin-bottom: 25px;">Looking forward to welcoming you to our luxury cinema experience! 🎬</p>

          <!-- Button to go to website with luxury styling -->
          <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
            <a href="https://cinematic-popcorn-park.com" style="background-color: #0D0D0D; color: #C8A951; padding: 15px 30px; text-decoration: none; font-size: 16px; font-family: 'Cinzel', serif; letter-spacing: 1px; border: 1px solid #C8A951; transition: all 0.3s ease; box-shadow: 0 0 10px rgba(200, 169, 81, 0.3);">
              VISIT OUR WEBSITE
            </a>
          </div>

          <footer style="font-size: 14px; text-align: center; margin-top: 30px; color: #C8A951; padding-top: 20px; border-top: 1px solid rgba(200, 169, 81, 0.2); font-family: 'Poppins', sans-serif;">
            <p>&copy; 2024 Cinematic Popcorn Park. All Rights Reserved.</p>
          </footer>
        </div>

        <style>
          /* Animation for fade-in */
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          /* Gold glow animation */
          @keyframes goldGlow {
            0% { box-shadow: 0 0 5px rgba(200, 169, 81, 0.3); }
            50% { box-shadow: 0 0 15px rgba(200, 169, 81, 0.5); }
            100% { box-shadow: 0 0 5px rgba(200, 169, 81, 0.3); }
          }

          /* Hover effect for links */
          a:hover {
            color: #E50914;
            border-color: #E50914;
            box-shadow: 0 0 15px rgba(229, 9, 20, 0.4);
            transition: all 0.3s ease-in-out;
          }
          
          /* Hover effect for container sections */
          div[style*="border-left"] {
            transition: all 0.3s ease;
          }
          
          div[style*="border-left"]:hover {
            border-left: 3px solid #C8A951;
            box-shadow: 0 0 15px rgba(200, 169, 81, 0.2);
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
