import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter with Gmail SMTP or your email service
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });
};

// Send contact form notification email
export const sendContactNotification = async (name, email, message) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email to receive contact messages
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #0D0D0D; color: #F5F5F5; padding: 20px; text-align: center;">
            <h2 style="color: #C8A951; margin: 0;">🎬 Cinematic Popcorn Park</h2>
            <h3 style="color: #F5F5F5; margin: 10px 0;">New Contact Message</h3>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h3 style="color: #0D0D0D; border-bottom: 2px solid #C8A951; padding-bottom: 10px;">Contact Details</h3>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h4 style="color: #0D0D0D; margin-bottom: 10px;">Message:</h4>
              <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #C8A951; border-radius: 5px;">
                <p style="margin: 0; line-height: 1.6;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #f0f0f0; border-radius: 5px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                This message was sent from the Cinematic Popcorn Park contact form.
              </p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
                Reply directly to this email to respond to the customer.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send FAQ question notification email
export const sendFAQNotification = async (userQuestion, userEmail) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email to receive FAQ questions
      subject: `New FAQ Question from ${userEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #0D0D0D; color: #F5F5F5; padding: 20px; text-align: center;">
            <h2 style="color: #C8A951; margin: 0;">🎬 Cinematic Popcorn Park</h2>
            <h3 style="color: #F5F5F5; margin: 10px 0;">New FAQ Question</h3>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h3 style="color: #0D0D0D; border-bottom: 2px solid #C8A951; padding-bottom: 10px;">Question Details</h3>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>From:</strong> ${userEmail}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h4 style="color: #0D0D0D; margin-bottom: 10px;">Question:</h4>
              <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #C8A951; border-radius: 5px;">
                <p style="margin: 0; line-height: 1.6;">${userQuestion}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #f0f0f0; border-radius: 5px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                This question was submitted through the FAQ section.
              </p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
                Consider adding this to your FAQ page if it's a common question.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('FAQ notification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending FAQ notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send confirmation email to user who submitted contact form
export const sendContactConfirmation = async (name, email) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Cinematic Popcorn Park!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #0D0D0D; color: #F5F5F5; padding: 20px; text-align: center;">
            <h2 style="color: #C8A951; margin: 0;">🎬 Cinematic Popcorn Park</h2>
            <h3 style="color: #F5F5F5; margin: 10px 0;">Thank You for Contacting Us!</h3>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h3 style="color: #0D0D0D;">Hi ${name},</h3>
            
            <p style="line-height: 1.6; color: #333;">
              Thank you for reaching out to Cinematic Popcorn Park! We have received your message and our team will get back to you as soon as possible.
            </p>
            
            <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
              <h4 style="color: #C8A951; margin: 0 0 10px 0;">What happens next?</h4>
              <p style="margin: 0; color: #666;">
                📧 We typically respond within 24 hours<br>
                🎬 Check your email for our response<br>
                ⭐ Thank you for choosing Cinematic Popcorn Park!
              </p>
            </div>
            
            <p style="line-height: 1.6; color: #333;">
              In the meantime, feel free to explore our website and check out our latest movie offerings!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #C8A951;">The Cinematic Popcorn Park Team</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Contact confirmation email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending contact confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send confirmation email to user who submitted FAQ question
export const sendFAQConfirmation = async (userEmail) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Your FAQ Question has been received - Cinematic Popcorn Park',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #0D0D0D; color: #F5F5F5; padding: 20px; text-align: center;">
            <h2 style="color: #C8A951; margin: 0;">🎬 Cinematic Popcorn Park</h2>
            <h3 style="color: #F5F5F5; margin: 10px 0;">Question Received!</h3>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h3 style="color: #0D0D0D;">Thank you for your question!</h3>
            
            <p style="line-height: 1.6; color: #333;">
              We have received your FAQ question and our team is reviewing it. We appreciate your interest in Cinematic Popcorn Park!
            </p>
            
            <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
              <h4 style="color: #C8A951; margin: 0 0 10px 0;">What's next?</h4>
              <p style="margin: 0; color: #666;">
                📝 Our team will review your question<br>
                💡 We may add it to our FAQ section to help others<br>
                📧 If needed, we'll reach out with a personal response
              </p>
            </div>
            
            <p style="line-height: 1.6; color: #333;">
              Check out our current FAQ section for answers to common questions, or browse our latest movie showtimes!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-size: 14px;">
                Thank you for helping us improve!<br>
                <strong style="color: #C8A951;">The Cinematic Popcorn Park Team</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('FAQ confirmation email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending FAQ confirmation email:', error);
    return { success: false, error: error.message };
  }
};
