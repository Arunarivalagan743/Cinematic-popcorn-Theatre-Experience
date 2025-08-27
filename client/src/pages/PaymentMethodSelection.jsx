import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faPlay, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const PaymentMethodSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState('stripe');

  const bookingData = location.state?.bookingData || JSON.parse(localStorage.getItem('bookingData') || '{}');

  if (!bookingData || !bookingData.totalCost) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">No Booking Data Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-[#C8A951] text-[#0D0D0D] px-6 py-2 rounded hover:bg-[#C8A951]/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleProceed = () => {
    if (selectedMethod === 'stripe') {
      navigate('/stripe-payment', { 
        state: { 
          bookingData,
          ...location.state 
        } 
      });
    } else {
      navigate('/payment-new', { 
        state: { 
          bookingData,
          ...location.state 
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[#C8A951] hover:text-[#C8A951]/80 transition-colors mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Seat Selection
          </button>
          <h1 className="text-3xl font-bold text-center text-[#F5F5F5]">Choose Payment Method</h1>
        </div>

        {/* Booking Summary */}
        <div className="bg-[#1A1A1A] rounded-lg p-6 mb-8 border border-[#C8A951]/20">
          <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">Booking Summary</h2>
          <div className="text-[#F5F5F5]">
            <p><span className="text-[#C8A951]">Movie:</span> {bookingData.movieDetails?.name || bookingData.movieDetails?.title || 'N/A'}</p>
            <p><span className="text-[#C8A951]">Total Amount:</span> ₹{bookingData.totalCost}</p>
          </div>
        </div>

        {/* Payment Method Options */}
        <div className="space-y-4 mb-8">
          {/* Stripe Payment */}
          <div 
            className={`bg-[#1A1A1A] rounded-lg p-6 border-2 cursor-pointer transition-all duration-300 ${
              selectedMethod === 'stripe' 
                ? 'border-[#C8A951] bg-[#C8A951]/5' 
                : 'border-[#C8A951]/20 hover:border-[#C8A951]/40'
            }`}
            onClick={() => setSelectedMethod('stripe')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCreditCard} className="text-[#C8A951] text-xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-[#F5F5F5]">Credit/Debit Card</h3>
                  <p className="text-[#F5F5F5]/70 text-sm">Secure payment with Stripe</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded mr-2">SECURE</span>
                    <span className="text-xs text-[#F5F5F5]/60">Visa, MasterCard, American Express</span>
                  </div>
                  
                  {/* Test Card Information */}
                  {selectedMethod === 'stripe' && (
                    <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                      <div className="text-blue-300 text-xs font-medium mb-1">
                        Test Card for Demo:
                      </div>
                      <div className="text-blue-200 text-xs">
                        <div><strong>Number:</strong> 4242 4242 4242 4242</div>
                        <div><strong>Expiry:</strong> Any future date • <strong>CVC:</strong> Any 3 digits</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedMethod === 'stripe' 
                  ? 'bg-[#C8A951] border-[#C8A951]' 
                  : 'border-[#F5F5F5]/30'
              }`}>
                {selectedMethod === 'stripe' && (
                  <div className="w-2 h-2 bg-[#0D0D0D] rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
            </div>
          </div>

          {/* Demo Payment */}
          <div 
            className={`bg-[#1A1A1A] rounded-lg p-6 border-2 cursor-pointer transition-all duration-300 ${
              selectedMethod === 'demo' 
                ? 'border-[#C8A951] bg-[#C8A951]/5' 
                : 'border-[#C8A951]/20 hover:border-[#C8A951]/40'
            }`}
            onClick={() => setSelectedMethod('demo')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faPlay} className="text-[#C8A951] text-xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-[#F5F5F5]">Demo Payment</h3>
                  <p className="text-[#F5F5F5]/70 text-sm">For testing purposes only</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded mr-2">DEMO</span>
                    <span className="text-xs text-[#F5F5F5]/60">No actual payment will be processed</span>
                  </div>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedMethod === 'demo' 
                  ? 'bg-[#C8A951] border-[#C8A951]' 
                  : 'border-[#F5F5F5]/30'
              }`}>
                {selectedMethod === 'demo' && (
                  <div className="w-2 h-2 bg-[#0D0D0D] rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        {selectedMethod === 'stripe' && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="text-green-400 mr-3 mt-0.5">🔒</div>
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Secure Payment</h4>
                <p className="text-[#F5F5F5]/80 text-sm">
                  Your payment information is encrypted and secure. We use Stripe, a PCI-compliant payment processor 
                  trusted by millions of businesses worldwide. Your card details are never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Demo Note */}
        {selectedMethod === 'demo' && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="text-blue-400 mr-3 mt-0.5">ℹ️</div>
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Demo Mode</h4>
                <p className="text-[#F5F5F5]/80 text-sm">
                  This is a demonstration of the booking system. No actual payment will be processed, 
                  and your booking will be created for testing purposes only.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          className="w-full bg-[#C8A951] text-[#0D0D0D] py-3 px-6 rounded-lg font-semibold hover:bg-[#C8A951]/90 transition-colors duration-300 flex items-center justify-center"
        >
          <FontAwesomeIcon 
            icon={selectedMethod === 'stripe' ? faCreditCard : faPlay} 
            className="mr-2" 
          />
          Proceed with {selectedMethod === 'stripe' ? 'Card Payment' : 'Demo Payment'}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
