import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { errorHandler } from '../utils/error.js';

// In-memory store for OTPs (in production, use Redis or database)
const otpStore = new Map();

// Email transporter configuration
const createTransporter = () => {
  // For development, you can use Gmail with app password
  // For production, use a proper email service like SendGrid, AWS SES, etc.
  
  if (process.env.NODE_ENV === 'production') {
    // Production email service (you'll need to configure this)
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  } else {
    // Development - use Ethereal Email for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

export const sendEmailOTP = async (req, res, next) => {
  try {
    const { phone, email } = req.body;

    if (!phone || !email) {
      return next(errorHandler(400, 'Phone number and email are required'));
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpId = crypto.randomUUID();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

    // Store OTP
    otpStore.set(otpId, {
      otp,
      phone,
      email,
      expiresAt,
      attempts: 0
    });

    // Create email content
    const emailSubject = 'Cinematic Popcorn Park - Phone Verification Code';
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%); color: #F5F5F5; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #C8A951; margin-bottom: 20px;">🍿 Cinematic Popcorn Park</h1>
          <h2 style="color: #F5F5F5; margin-bottom: 30px;">Phone Verification Code</h2>
          
          <div style="background: #2A2A2A; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin-bottom: 15px;">Your verification code for phone number:</p>
            <p style="font-size: 18px; color: #C8A951; margin-bottom: 15px;"><strong>${phone}</strong></p>
            
            <div style="background: #C8A951; color: #0D0D0D; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="font-size: 32px; margin: 0; letter-spacing: 8px;">${otp}</h3>
            </div>
            
            <p style="font-size: 14px; color: #CCCCCC; margin-top: 15px;">
              This code will expire in <strong>10 minutes</strong>
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #444;">
            <p style="font-size: 12px; color: #AAAAAA;">
              If you didn't request this verification, please ignore this email.<br/>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email
    const transporter = createTransporter();
    
    if (process.env.NODE_ENV === 'development') {
      // In development, just log the OTP instead of sending email
      console.log(`
        📧 EMAIL OTP (Development Mode):
        To: ${email}
        Phone: ${phone}
        OTP: ${otp}
        OTP ID: ${otpId}
        Expires: ${new Date(expiresAt).toLocaleString()}
      `);
      
      res.status(200).json({
        success: true,
        message: 'OTP generated successfully (check console in development)',
        otpId,
        development: true
      });
    } else {
      // In production, send actual email
      await transporter.sendMail({
        from: `"Cinematic Popcorn Park" <${process.env.EMAIL_USER || 'noreply@cinematicpopcornpark.com'}>`,
        to: email,
        subject: emailSubject,
        html: emailBody
      });

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email successfully',
        otpId
      });
    }

    // Clean up expired OTPs
    cleanupExpiredOTPs();

  } catch (error) {
    console.error('Error sending email OTP:', error);
    next(errorHandler(500, 'Failed to send email OTP'));
  }
};

export const verifyEmailOTP = async (req, res, next) => {
  try {
    const { otpId, otp, phone } = req.body;

    if (!otpId || !otp || !phone) {
      return next(errorHandler(400, 'OTP ID, OTP code, and phone number are required'));
    }

    const storedData = otpStore.get(otpId);

    if (!storedData) {
      return next(errorHandler(400, 'Invalid or expired OTP ID'));
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(otpId);
      return next(errorHandler(400, 'OTP has expired. Please request a new one'));
    }

    // Check if too many attempts
    if (storedData.attempts >= 5) {
      otpStore.delete(otpId);
      return next(errorHandler(400, 'Too many invalid attempts. Please request a new OTP'));
    }

    // Verify OTP
    if (storedData.otp !== otp.trim()) {
      storedData.attempts += 1;
      otpStore.set(otpId, storedData);
      return next(errorHandler(400, `Invalid OTP. ${5 - storedData.attempts} attempts remaining`));
    }

    // Verify phone number matches
    if (storedData.phone !== phone) {
      return next(errorHandler(400, 'Phone number mismatch'));
    }

    // OTP verified successfully
    otpStore.delete(otpId);

    res.status(200).json({
      success: true,
      message: 'Phone number verified successfully via email',
      phone: storedData.phone
    });

  } catch (error) {
    console.error('Error verifying email OTP:', error);
    next(errorHandler(500, 'Failed to verify email OTP'));
  }
};

// Helper function to clean up expired OTPs
const cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [otpId, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(otpId);
    }
  }
};

// Clean up expired OTPs every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);
