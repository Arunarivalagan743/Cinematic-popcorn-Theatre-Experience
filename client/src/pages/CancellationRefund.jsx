import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faCreditCard, faCalendarTimes, faExclamationCircle, faPhoneAlt, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';

const CancellationRefund = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5] p-6 font-poppins">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold mb-12 text-center text-[#C8A951] tracking-wide animate-fadeIn" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
          <FontAwesomeIcon icon={faUndo} className="mr-3 text-[#C8A951]" style={{filter: 'drop-shadow(0 0 5px rgba(200, 169, 81, 0.4))'}} />
          Cancellation & Refund Policy
        </h1>

        <div className="bg-[#0D0D0D] border border-[#C8A951]/20 shadow-lg p-8 mb-8" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.2)'}}>
          <p className="text-[#F5F5F5]/90 mb-6 leading-relaxed">
            <strong className="text-[#C8A951]">Last Updated:</strong> August 19, 2025
          </p>
          
          <p className="text-[#F5F5F5]/90 mb-8 leading-relaxed">
            At Cinematic Popcorn Park, we understand that plans can change. This policy outlines our cancellation and refund procedures 
            for movie tickets, parking reservations, and combination bookings to ensure transparency and fair treatment for all customers.
          </p>

          {/* Movie Ticket Cancellation */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faCalendarTimes} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Movie Ticket Cancellation Policy
            </h2>
            
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] border border-[#C8A951]/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-[#C8A951] flex items-center">
                  <FontAwesomeIcon icon={faClockRotateLeft} className="mr-2 text-[#E50914]" />
                  Cancellation Timeline
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-[#4CAF50] pl-4">
                      <h4 className="font-semibold text-[#4CAF50]">24+ Hours Before Show</h4>
                      <p className="text-[#F5F5F5]/80 text-sm">Full refund minus processing fee (₹20 per ticket)</p>
                    </div>
                    
                    <div className="border-l-4 border-[#FF9800] pl-4">
                      <h4 className="font-semibold text-[#FF9800]">4-24 Hours Before Show</h4>
                      <p className="text-[#F5F5F5]/80 text-sm">75% refund of ticket price</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-[#F44336] pl-4">
                      <h4 className="font-semibold text-[#F44336]">1-4 Hours Before Show</h4>
                      <p className="text-[#F5F5F5]/80 text-sm">50% refund of ticket price</p>
                    </div>
                    
                    <div className="border-l-4 border-[#9E9E9E] pl-4">
                      <h4 className="font-semibold text-[#9E9E9E]">Less Than 1 Hour</h4>
                      <p className="text-[#F5F5F5]/80 text-sm">No refund available</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Special Conditions</h3>
                <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>• Premium and VIP tickets have enhanced cancellation terms (up to 2 hours before show)</li>
                  <li>• Group bookings (5+ tickets) qualify for extended cancellation windows</li>
                  <li>• Festival releases and special screenings may have stricter cancellation policies</li>
                  <li>• Promotional tickets purchased with discounts may have limited refund eligibility</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Parking Cancellation */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faCalendarTimes} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Parking Reservation Cancellation
            </h2>
            
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] border border-[#C8A951]/30 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center border-r border-[#C8A951]/30 pr-4">
                    <h4 className="font-semibold text-[#4CAF50] mb-2">2+ Hours Before</h4>
                    <p className="text-[#F5F5F5]/80 text-sm">100% Refund</p>
                  </div>
                  
                  <div className="text-center border-r border-[#C8A951]/30 pr-4">
                    <h4 className="font-semibold text-[#FF9800] mb-2">30min - 2 Hours</h4>
                    <p className="text-[#F5F5F5]/80 text-sm">₹20 Cancellation Fee</p>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-semibold text-[#F44336] mb-2">Less Than 30min</h4>
                    <p className="text-[#F5F5F5]/80 text-sm">No Refund</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Parking-Specific Terms</h3>
                <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>• Premium parking spots have a ₹50 cancellation fee regardless of timing</li>
                  <li>• Dynamic pricing adjustments are not eligible for refunds due to rate changes</li>
                  <li>• No-show for reserved parking results in full charge with no refund</li>
                  <li>• Weather-related cancellations by parking partners qualify for full refund</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faCreditCard} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Refund Processing
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Processing Timeline</h3>
                <div className="bg-[#1A1A1A] border border-[#C8A951]/30 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-[#C8A951] mb-3">Payment Method</h4>
                      <ul className="space-y-2 text-[#F5F5F5]/90">
                        <li>• Credit/Debit Cards: 5-7 business days</li>
                        <li>• UPI: 1-2 business days</li>
                        <li>• Net Banking: 3-5 business days</li>
                        <li>• Digital Wallets: 1-3 business days</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[#C8A951] mb-3">Bank Processing</h4>
                      <ul className="space-y-2 text-[#F5F5F5]/90">
                        <li>• Additional 1-2 days for bank processing</li>
                        <li>• Weekend/holiday delays may apply</li>
                        <li>• International cards: 7-10 business days</li>
                        <li>• SMS/Email confirmation sent when processed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">How to Request Refund</h3>
                <ol className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>1. Log into your account and go to 'My Bookings'</li>
                  <li>2. Select the booking you want to cancel</li>
                  <li>3. Click 'Cancel Booking' and confirm your choice</li>
                  <li>4. Refund will be processed automatically based on our policy</li>
                  <li>5. Receive confirmation email with refund details</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Exceptional Circumstances */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faExclamationCircle} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Exceptional Circumstances
            </h2>
            
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] border border-[#C8A951]/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-[#C8A951]">Full Refund Scenarios</h3>
                <ul className="space-y-3 text-[#F5F5F5]/90">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#4CAF50] rounded-full mr-3 mt-2"></div>
                    <span><strong className="text-[#4CAF50]">Cinema Closure:</strong> Technical issues, power outage, or emergency closure</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#4CAF50] rounded-full mr-3 mt-2"></div>
                    <span><strong className="text-[#4CAF50]">Show Cancellation:</strong> Movie cancelled by distributor or cinema</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#4CAF50] rounded-full mr-3 mt-2"></div>
                    <span><strong className="text-[#4CAF50]">Medical Emergency:</strong> Hospitalization with valid medical certificate</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#4CAF50] rounded-full mr-3 mt-2"></div>
                    <span><strong className="text-[#4CAF50]">Natural Disasters:</strong> Government-declared emergencies or severe weather</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#4CAF50] rounded-full mr-3 mt-2"></div>
                    <span><strong className="text-[#4CAF50]">Platform Error:</strong> Technical glitch resulting in incorrect booking</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Special Consideration Process</h3>
                <p className="text-[#F5F5F5]/90 mb-4 leading-relaxed">
                  For exceptional circumstances, contact our customer support with relevant documentation. 
                  Each case will be reviewed individually, and we may offer:
                </p>
                <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>• Full refund regardless of timing</li>
                  <li>• Credit voucher for future bookings</li>
                  <li>• Free rebooking to alternative showtimes</li>
                  <li>• Complimentary upgrades for inconvenience</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Non-Refundable Items */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faExclamationCircle} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Non-Refundable Services
            </h2>
            
            <div className="bg-[#1A1A1A] border border-[#F44336]/30 p-6 rounded-lg">
              <ul className="space-y-3 text-[#F5F5F5]/90">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#F44336] rounded-full mr-3 mt-2"></div>
                  <span>Processing fees and payment gateway charges</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#F44336] rounded-full mr-3 mt-2"></div>
                  <span>Gift vouchers and promotional codes (unless policy-specific terms apply)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#F44336] rounded-full mr-3 mt-2"></div>
                  <span>Corporate bulk booking deposits (special terms apply)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#F44336] rounded-full mr-3 mt-2"></div>
                  <span>Service charges for premium customer support</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#F44336] rounded-full mr-3 mt-2"></div>
                  <span>Third-party add-on services (food combos, merchandising)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faPhoneAlt} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Refund Support
            </h2>
            
            <p className="text-[#F5F5F5]/90 mb-4 leading-relaxed">
              Need help with cancellations or refunds? Our support team is here to assist:
            </p>
            
            <div className="bg-[#1A1A1A] border border-[#C8A951]/30 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#C8A951] mb-3">Quick Support</h3>
                  <p className="text-[#F5F5F5]/90 mb-2">
                    <strong>Email:</strong> refunds@cinematicpopcornpark.com
                  </p>
                  <p className="text-[#F5F5F5]/90 mb-2">
                    <strong>Phone:</strong> +91 98765 43212 (Refunds Hotline)
                  </p>
                  <p className="text-[#F5F5F5]/90">
                    <strong>Hours:</strong> 24/7 for urgent cancellations
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#C8A951] mb-3">Self-Service</h3>
                  <p className="text-[#F5F5F5]/90 mb-2">• Online cancellation portal in your account</p>
                  <p className="text-[#F5F5F5]/90 mb-2">• Mobile app instant cancellation feature</p>
                  <p className="text-[#F5F5F5]/90">• WhatsApp support: +91 98765 43213</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#C8A951]/30">
                <p className="text-[#C8A951] text-sm font-semibold text-center">
                  Average refund processing time: 3-5 business days | Customer satisfaction rate: 98.5%
                </p>
              </div>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="border-t border-[#C8A951]/30 pt-6">
            <h2 className="text-xl font-cinzel font-semibold mb-4 text-[#C8A951]">Policy Updates</h2>
            <p className="text-[#F5F5F5]/90 leading-relaxed">
              This cancellation and refund policy may be updated to reflect changes in our services, legal requirements, 
              or industry standards. Customers will be notified of significant changes via email and prominent notices 
              on our platform. The updated policy will apply to all new bookings made after the effective date, 
              while existing bookings will follow the terms that were active at the time of booking.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CancellationRefund;
