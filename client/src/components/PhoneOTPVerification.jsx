import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebaseIdentityPlatform';
// import EmailOTPVerification from './EmailOTPVerification';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPhone, faShieldAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const PhoneOTPVerification = ({ 
  phoneNumber, 
  onVerificationSuccess, 
  onVerificationError,
  isVisible,
  onClose 
}) => {
  const [verificationId, setVerificationId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isVisible && !recaptchaVerifier) {
      setupRecaptcha();
    }

    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [isVisible]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const setupRecaptcha = () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: (response) => {
          console.log('Recaptcha resolved');
        },
        'expired-callback': () => {
          console.log('Recaptcha expired');
        }
      });
      setRecaptchaVerifier(recaptcha);
    } catch (error) {
      console.error('Error setting up recaptcha:', error);
    }
  };

  const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If the number doesn't start with country code, add +91 for India
    if (digits.length === 10) {
      return `+91${digits}`;
    } else if (digits.length === 12 && digits.startsWith('91')) {
      return `+${digits}`;
    } else if (phone.startsWith('+')) {
      return phone;
    }
    
    return `+91${digits}`;
  };

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a valid phone number',
        icon: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Sending OTP to:', formattedPhone);
      
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        recaptchaVerifier
      );
      
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
      setCountdown(60); // 60 seconds countdown
      
      Swal.fire({
        title: 'OTP Sent!',
        text: `Verification code has been sent to ${formattedPhone}`,
        icon: 'success',
        timer: 3000
      });
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'Captcha verification failed. Please try again.';
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
      
      // Reset recaptcha for retry
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        setupRecaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a valid 6-digit OTP',
        icon: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const credential = await auth.currentUser?.linkWithCredential 
        ? auth.currentUser.linkWithCredential(verificationId, otp)
        : await import('firebase/auth').then(({ PhoneAuthProvider, signInWithCredential }) => {
            const phoneCredential = PhoneAuthProvider.credential(verificationId, otp);
            return signInWithCredential(auth, phoneCredential);
          });

      Swal.fire({
        title: 'Success!',
        text: 'Phone number verified successfully',
        icon: 'success',
        timer: 2000
      });

      onVerificationSuccess({
        phoneNumber: formatPhoneNumber(phoneNumber),
        verified: true
      });

    } catch (error) {
      console.error('Error verifying OTP:', error);
      let errorMessage = 'Invalid verification code. Please try again.';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid verification code. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'Verification code has expired. Please request a new one.';
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
      
      onVerificationError(error);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = () => {
    if (countdown > 0) return;
    
    setOtp('');
    setOtpSent(false);
    setVerificationId('');
    
    // Clear and reset recaptcha
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      setupRecaptcha();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-blue-600" />
            Phone Verification
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            We'll send a verification code to: <strong>{formatPhoneNumber(phoneNumber)}</strong>
          </p>
        </div>

        {!otpSent ? (
          <div>
            <div id="recaptcha-container" className="mb-4"></div>
            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  Send OTP
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit verification code:
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                maxLength={6}
              />
            </div>

            <button
              onClick={verifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-3"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in {countdown} seconds
                </p>
              ) : (
                <button
                  onClick={resendOTP}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <p>• Standard messaging rates may apply</p>
          <p>• You'll receive a 6-digit verification code</p>
          <p>• Code expires in 5 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default PhoneOTPVerification;
