import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faUserCheck, faExclamationTriangle, faGavel, faHandshake, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5] p-6 font-poppins">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold mb-12 text-center text-[#C8A951] tracking-wide animate-fadeIn" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
          <FontAwesomeIcon icon={faFileContract} className="mr-3 text-[#C8A951]" style={{filter: 'drop-shadow(0 0 5px rgba(200, 169, 81, 0.4))'}} />
          Terms & Conditions
        </h1>

        <div className="bg-[#0D0D0D] border border-[#C8A951]/20 shadow-lg p-8 mb-8" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.2)'}}>
          <p className="text-[#F5F5F5]/90 mb-6 leading-relaxed">
            <strong className="text-[#C8A951]">Last Updated:</strong> August 19, 2025
          </p>
          
          <p className="text-[#F5F5F5]/90 mb-8 leading-relaxed">
            Welcome to Cinematic Popcorn Park. These Terms and Conditions ("Terms") govern your use of our movie booking platform, 
            parking services, and related features. By accessing or using our services, you agree to be bound by these Terms.
          </p>

          {/* Acceptance of Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faHandshake} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Acceptance of Terms
            </h2>
            
            <ul className="space-y-3 text-[#F5F5F5]/90">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>By creating an account or using our services, you confirm that you are at least 18 years old or have parental consent</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>You agree to comply with all applicable laws and regulations</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>You acknowledge that these Terms may be updated periodically, and continued use constitutes acceptance</span>
              </li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faUserCheck} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              User Accounts and Responsibilities
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Account Creation</h3>
                <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>• You must provide accurate and complete information during registration</li>
                  <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>• You must notify us immediately of any unauthorized account access</li>
                  <li>• One person may not maintain multiple accounts without our consent</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Prohibited Activities</h3>
                <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>• Using automated systems to make bookings or manipulate pricing</li>
                  <li>• Reselling tickets at inflated prices (scalping)</li>
                  <li>• Sharing account credentials with unauthorized persons</li>
                  <li>• Attempting to circumvent security measures or access restrictions</li>
                  <li>• Using the platform for any illegal or fraudulent activities</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Booking Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faGavel} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Booking and Payment Terms
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Movie Ticket Bookings</h3>
                <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>• All bookings are subject to availability and cinema terms</li>
                  <li>• Ticket prices may vary based on showtime, seating category, and demand</li>
                  <li>• Age restrictions apply to certain movies as per certification guidelines</li>
                  <li>• Tickets are non-transferable except as permitted by cinema policies</li>
                  <li>• Late entry policies are determined by individual cinema partners</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Parking Reservations</h3>
                <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>• Parking rates are subject to dynamic pricing based on demand</li>
                  <li>• Parking slots are automatically matched to your seat selection when possible</li>
                  <li>• Parking duration is typically limited to 1 hour before show start to 30 minutes after show end</li>
                  <li>• Overstay charges may apply as per parking partner terms</li>
                  <li>• Vehicle size restrictions apply for certain parking categories</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Payment Processing</h3>
                <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>• All payments are processed through secure, PCI-DSS compliant gateways</li>
                  <li>• Booking is confirmed only after successful payment verification</li>
                  <li>• Failed payments may result in automatic booking cancellation</li>
                  <li>• Payment methods include cards, UPI, net banking, and approved digital wallets</li>
                  <li>• Processing fees may apply for certain payment methods</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Service Availability */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faShieldAlt} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Service Availability and Limitations
            </h2>
            
            <ul className="space-y-3 text-[#F5F5F5]/90">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Platform Availability:</strong> Services are available 24/7 but may be interrupted for maintenance</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Third-Party Dependency:</strong> Some features depend on cinema and parking partner systems</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Real-Time Updates:</strong> Seat availability and pricing are updated in real-time but may have brief delays</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Force Majeure:</strong> We are not liable for service disruptions due to circumstances beyond our control</span>
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faShieldAlt} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Intellectual Property Rights
            </h2>
            
            <ul className="space-y-3 text-[#F5F5F5]/90">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>All platform content, including design, logos, and software, is owned by Cinematic Popcorn Park</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>Movie content, posters, and trailers are owned by respective production companies</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>Users may not reproduce, distribute, or modify platform content without permission</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>Trademark violations or copyright infringement will result in account termination</span>
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Limitation of Liability
            </h2>
            
            <div className="bg-[#1A1A1A] border border-[#C8A951]/30 p-6 rounded-lg">
              <ul className="space-y-3 text-[#F5F5F5]/90">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                  <span>Our liability is limited to the amount paid for the specific booking in question</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                  <span>We are not responsible for losses due to cinema closures, show cancellations, or parking unavailability</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                  <span>We do not guarantee uninterrupted service or error-free operation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                  <span>Users agree to indemnify us against claims arising from their misuse of the platform</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faGavel} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Dispute Resolution
            </h2>
            
            <div className="space-y-4">
              <p className="text-[#F5F5F5]/90 leading-relaxed">
                In case of disputes, we encourage users to first contact our customer support team for resolution. 
                If a satisfactory resolution cannot be reached:
              </p>
              
              <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                <li>• Disputes will be resolved through binding arbitration under Indian Arbitration and Conciliation Act</li>
                <li>• The jurisdiction for any legal proceedings will be Mumbai, Maharashtra, India</li>
                <li>• Indian law will govern the interpretation and enforcement of these Terms</li>
                <li>• Class action lawsuits and jury trials are waived</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faHandshake} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Contact Information
            </h2>
            
            <p className="text-[#F5F5F5]/90 mb-4 leading-relaxed">
              For questions about these Terms and Conditions or to report violations:
            </p>
            
            <div className="bg-[#1A1A1A] border border-[#C8A951]/30 p-6 rounded-lg">
              <p className="text-[#F5F5F5]/90 mb-2">
                <strong className="text-[#C8A951]">Legal Team:</strong> legal@cinematicpopcornpark.com
              </p>
              <p className="text-[#F5F5F5]/90 mb-2">
                <strong className="text-[#C8A951]">Customer Support:</strong> support@cinematicpopcornpark.com
              </p>
              <p className="text-[#F5F5F5]/90 mb-2">
                <strong className="text-[#C8A951]">Phone:</strong> +91 98765 43210
              </p>
              <p className="text-[#F5F5F5]/90">
                <strong className="text-[#C8A951]">Address:</strong> 123 Cinema Boulevard, Entertainment District, Mumbai, India 400001
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="border-t border-[#C8A951]/30 pt-6">
            <h2 className="text-xl font-cinzel font-semibold mb-4 text-[#C8A951]">Account Termination</h2>
            <p className="text-[#F5F5F5]/90 leading-relaxed mb-4">
              We reserve the right to suspend or terminate accounts that violate these Terms. 
              Users may also request account deletion at any time, subject to our data retention policies. 
              Upon termination, all rights and licenses granted to the user will immediately cease.
            </p>
            
            <p className="text-[#F5F5F5]/90 leading-relaxed">
              These Terms constitute the entire agreement between you and Cinematic Popcorn Park regarding the use of our services. 
              Any modifications must be made in writing and agreed to by both parties.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsConditions;
