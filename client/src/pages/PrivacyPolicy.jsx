import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faLock, faUserShield, faDatabase, faCookie, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5] p-6 font-poppins">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold mb-12 text-center text-[#C8A951] tracking-wide animate-fadeIn" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
          <FontAwesomeIcon icon={faShieldAlt} className="mr-3 text-[#C8A951]" style={{filter: 'drop-shadow(0 0 5px rgba(200, 169, 81, 0.4))'}} />
          Privacy Policy
        </h1>

        <div className="bg-[#0D0D0D] border border-[#C8A951]/20 shadow-lg p-8 mb-8" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.2)'}}>
          <p className="text-[#F5F5F5]/90 mb-6 leading-relaxed">
            <strong className="text-[#C8A951]">Last Updated:</strong> August 19, 2025
          </p>
          
          <p className="text-[#F5F5F5]/90 mb-8 leading-relaxed">
            At Cinematic Popcorn Park, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our movie booking platform and related services.
          </p>

          {/* Information We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faDatabase} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Personal Information</h3>
                <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>• Name and contact details (email, phone number)</li>
                  <li>• Account credentials and profile information</li>
                  <li>• Payment information (processed securely through third-party providers)</li>
                  <li>• Booking history and preferences</li>
                  <li>• Age verification for movie ratings compliance</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#C8A951]">Automatically Collected Information</h3>
                <ul className="space-y-2 text-[#F5F5F5]/90 ml-4">
                  <li>• Device information and browser type</li>
                  <li>• IP address and location data (for show timings and parking availability)</li>
                  <li>• Usage patterns and feature interactions</li>
                  <li>• Session data and performance metrics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faUserShield} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              How We Use Your Information
            </h2>
            
            <ul className="space-y-3 text-[#F5F5F5]/90">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Service Provision:</strong> Process bookings, manage reservations, and provide customer support</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Smart Parking:</strong> Optimize parking slot allocation based on seat selection and availability</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Personalization:</strong> Recommend movies and showtimes based on your preferences</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Communication:</strong> Send booking confirmations, updates, and promotional offers</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Platform Improvement:</strong> Analyze usage patterns to enhance user experience</span>
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faLock} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Data Security
            </h2>
            
            <p className="text-[#F5F5F5]/90 mb-4 leading-relaxed">
              We implement industry-standard security measures to protect your personal information:
            </p>
            
            <ul className="space-y-3 text-[#F5F5F5]/90">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>SSL/TLS encryption for all data transmission</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>Secure payment processing through PCI-DSS compliant providers</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>Regular security audits and vulnerability assessments</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>Access controls and employee training on data protection</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>Data backup and disaster recovery procedures</span>
              </li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faCookie} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Cookies and Tracking Technologies
            </h2>
            
            <p className="text-[#F5F5F5]/90 mb-4 leading-relaxed">
              We use cookies and similar technologies to enhance your experience:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#C8A951]">Essential Cookies</h3>
                <p className="text-[#F5F5F5]/80">Required for basic functionality like login sessions and shopping cart</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#C8A951]">Performance Cookies</h3>
                <p className="text-[#F5F5F5]/80">Help us analyze website performance and user interactions</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#C8A951]">Functional Cookies</h3>
                <p className="text-[#F5F5F5]/80">Remember your preferences and settings for a personalized experience</p>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faUserShield} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Information Sharing
            </h2>
            
            <p className="text-[#F5F5F5]/90 mb-4 leading-relaxed">
              We do not sell your personal information. We may share data only in these circumstances:
            </p>
            
            <ul className="space-y-3 text-[#F5F5F5]/90">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>With payment processors for transaction completion</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>With cinema partners for booking fulfillment</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>With service providers under strict confidentiality agreements</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span>When required by law or to protect our rights and safety</span>
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faUserShield} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Your Privacy Rights
            </h2>
            
            <p className="text-[#F5F5F5]/90 mb-4 leading-relaxed">
              You have the following rights regarding your personal information:
            </p>
            
            <ul className="space-y-3 text-[#F5F5F5]/90">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Access:</strong> Request a copy of your personal data</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Correction:</strong> Update or correct inaccurate information</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Deletion:</strong> Request deletion of your account and data</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Portability:</strong> Export your data in a readable format</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3 mt-2"></div>
                <span><strong className="text-[#C8A951]">Opt-out:</strong> Unsubscribe from promotional communications</span>
              </li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] flex items-center" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
              <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Contact Us About Privacy
            </h2>
            
            <p className="text-[#F5F5F5]/90 mb-4 leading-relaxed">
              If you have questions about this Privacy Policy or want to exercise your rights:
            </p>
            
            <div className="bg-[#1A1A1A] border border-[#C8A951]/30 p-6 rounded-lg">
              <p className="text-[#F5F5F5]/90 mb-2">
                <strong className="text-[#C8A951]">Email:</strong> privacy@cinematicpopcornpark.com
              </p>
              <p className="text-[#F5F5F5]/90 mb-2">
                <strong className="text-[#C8A951]">Phone:</strong> +91 98765 43210
              </p>
              <p className="text-[#F5F5F5]/90">
                <strong className="text-[#C8A951]">Address:</strong> 123 Cinema Boulevard, Entertainment District, Mumbai, India 400001
              </p>
            </div>
          </section>

          {/* Updates */}
          <section className="border-t border-[#C8A951]/30 pt-6">
            <h2 className="text-xl font-cinzel font-semibold mb-4 text-[#C8A951]">Policy Updates</h2>
            <p className="text-[#F5F5F5]/90 leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
              We will notify you of significant changes through email or prominent notices on our platform. 
              Your continued use of our services after such modifications constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
