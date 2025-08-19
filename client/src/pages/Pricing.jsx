import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt, faCar, faUsers, faStar, faCrown, faGem } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';

const Pricing = () => {
  const ticketPrices = [
    {
      category: "Standard",
      icon: faTicketAlt,
      color: "#E50914",
      price: "₹150",
      features: [
        "Regular seating",
        "Standard screen viewing",
        "Basic sound system",
        "Access to concessions",
        "Online booking available"
      ]
    },
    {
      category: "Premium",
      icon: faStar,
      color: "#C8A951",
      price: "₹250",
      features: [
        "Premium comfortable seating",
        "Enhanced viewing experience",
        "Dolby Atmos sound",
        "Priority entry",
        "Complimentary popcorn",
        "Reserved parking slot"
      ]
    },
    {
      category: "VIP Experience",
      icon: faCrown,
      color: "#FFD700",
      price: "₹450",
      features: [
        "Luxury recliner seats",
        "Private screening area",
        "Premium food & beverages",
        "Personal service attendant",
        "Valet parking included",
        "Exclusive lounge access"
      ]
    }
  ];

  const parkingRates = [
    {
      type: "Two Wheeler",
      icon: faCar,
      baseRate: "₹20",
      peakRate: "₹30",
      description: "Secure parking for motorcycles and scooters"
    },
    {
      type: "Four Wheeler",
      icon: faCar,
      baseRate: "₹50",
      peakRate: "₹75",
      description: "Covered parking for cars and SUVs"
    },
    {
      type: "Premium Parking",
      icon: faGem,
      baseRate: "₹100",
      peakRate: "₹125",
      description: "VIP parking with valet service"
    }
  ];

  const groupBookings = [
    {
      size: "5-10 People",
      discount: "10%",
      benefits: ["Group discount", "Flexible seating arrangement", "Dedicated booking support"]
    },
    {
      size: "11-20 People",
      discount: "15%",
      benefits: ["Enhanced group discount", "Priority seating selection", "Complimentary refreshments", "Event coordination"]
    },
    {
      size: "20+ People",
      discount: "20%",
      benefits: ["Maximum discount", "Private screening options", "Custom catering available", "Dedicated event manager"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5] p-6 font-poppins">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold mb-12 text-center text-[#C8A951] tracking-wide animate-fadeIn" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
          <FontAwesomeIcon icon={faTicketAlt} className="mr-3 text-[#C8A951]" style={{filter: 'drop-shadow(0 0 5px rgba(200, 169, 81, 0.4))'}} />
          Pricing & Packages
        </h1>

        {/* Ticket Pricing Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-cinzel font-semibold mb-8 text-center text-[#C8A951]" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
            Movie Ticket Pricing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ticketPrices.map((ticket, index) => (
              <div key={index} className="bg-[#0D0D0D] border border-[#C8A951]/20 shadow-lg p-8 hover:scale-105 transform transition duration-500 relative overflow-hidden" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.2)'}}>
                {ticket.category === "Premium" && (
                  <div className="absolute top-0 right-0 bg-[#C8A951] text-[#0D0D0D] px-3 py-1 text-sm font-bold transform rotate-12 translate-x-2 -translate-y-2">
                    POPULAR
                  </div>
                )}
                
                <div className="text-center">
                  <FontAwesomeIcon 
                    icon={ticket.icon} 
                    className="text-4xl mb-4" 
                    style={{color: ticket.color, filter: `drop-shadow(0 0 5px ${ticket.color}50)`}} 
                  />
                  <h3 className="text-2xl font-cinzel font-bold mb-2 text-[#C8A951]">{ticket.category}</h3>
                  <div className="text-4xl font-bold mb-6 text-[#F5F5F5]">{ticket.price}</div>
                  
                  <ul className="space-y-3 text-left">
                    {ticket.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-[#F5F5F5]/90">
                        <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full mt-6 bg-[#C8A951] text-[#0D0D0D] px-6 py-3 rounded-lg font-semibold hover:bg-[#B8994A] transform hover:scale-105 transition duration-300" style={{boxShadow: '0 4px 15px rgba(200, 169, 81, 0.3)'}}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Parking Pricing Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-cinzel font-semibold mb-8 text-center text-[#C8A951]" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
            Smart Parking Rates
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {parkingRates.map((parking, index) => (
              <div key={index} className="bg-[#0D0D0D] border border-[#C8A951]/20 shadow-lg p-8 hover:scale-105 transform transition duration-500" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.2)'}}>
                <div className="text-center">
                  <FontAwesomeIcon 
                    icon={parking.icon} 
                    className="text-4xl mb-4 text-[#E50914]" 
                    style={{filter: 'drop-shadow(0 0 5px rgba(229, 9, 20, 0.5))'}} 
                  />
                  <h3 className="text-xl font-cinzel font-bold mb-4 text-[#C8A951]">{parking.type}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#F5F5F5]/80">Regular Hours:</span>
                      <span className="text-[#C8A951] font-bold">{parking.baseRate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#F5F5F5]/80">Peak Hours:</span>
                      <span className="text-[#E50914] font-bold">{parking.peakRate}</span>
                    </div>
                  </div>
                  
                  <p className="text-[#F5F5F5]/80 text-sm">{parking.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-[#F5F5F5]/80 text-sm">
              * Peak hours: Friday 6 PM - Sunday 11 PM and all public holidays
            </p>
            <p className="text-[#C8A951] text-sm mt-2">
              Dynamic pricing adjusts rates based on demand and availability
            </p>
          </div>
        </section>

        {/* Group Booking Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-cinzel font-semibold mb-8 text-center text-[#C8A951]" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
            Group Booking Discounts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {groupBookings.map((group, index) => (
              <div key={index} className="bg-[#0D0D0D] border border-[#C8A951]/20 shadow-lg p-8 hover:scale-105 transform transition duration-500" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.2)'}}>
                <div className="text-center">
                  <FontAwesomeIcon 
                    icon={faUsers} 
                    className="text-4xl mb-4 text-[#C8A951]" 
                    style={{filter: 'drop-shadow(0 0 5px rgba(200, 169, 81, 0.4))'}} 
                  />
                  <h3 className="text-xl font-cinzel font-bold mb-2 text-[#C8A951]">{group.size}</h3>
                  <div className="text-2xl font-bold mb-4 text-[#E50914]">{group.discount} OFF</div>
                  
                  <ul className="space-y-2 text-left">
                    {group.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-[#F5F5F5]/90">
                        <div className="w-2 h-2 bg-[#C8A951] rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Information */}
        <section className="bg-[#0D0D0D] border border-[#C8A951]/20 shadow-lg p-8 mb-8" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.2)'}}>
          <h2 className="text-2xl font-cinzel font-semibold mb-6 text-center text-[#C8A951]" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>
            Additional Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#C8A951]">Payment Options</h3>
              <ul className="space-y-2 text-[#F5F5F5]/90">
                <li>• Credit/Debit Cards</li>
                <li>• UPI Payments</li>
                <li>• Net Banking</li>
                <li>• Digital Wallets</li>
                <li>• Cash at Counter</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#C8A951]">Special Offers</h3>
              <ul className="space-y-2 text-[#F5F5F5]/90">
                <li>• Student Discounts (Valid ID required)</li>
                <li>• Senior Citizen Discounts (60+ age)</li>
                <li>• Birthday Special Offers</li>
                <li>• Corporate Bulk Bookings</li>
                <li>• Festival Season Promotions</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-[#F5F5F5]/80 text-sm">
              All prices are inclusive of applicable taxes. Prices subject to change without prior notice.
            </p>
            <p className="text-[#C8A951] text-sm mt-2">
              For bulk bookings and special events, please contact our sales team for custom pricing.
            </p>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;
