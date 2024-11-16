import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faChevronDown, faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [activeTab, setActiveTab] = useState("faq");
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const faqs = [
    {
      question: "How does dynamic pricing work?",
      answer: "Parking rates vary based on demand, optimizing space and reducing congestion during peak hours.",
    },
    {
      question: "Can I book both a movie ticket and a parking slot?",
      answer: "Yes, you can conveniently book both in a single step, ensuring stress-free planning.",
    },
    {
      question: "How is payment handled?",
      answer: "Payments are processed securely through our app with encrypted gateways and data protection.",
    },
    {
      question: "What is seat-to-slot matching?",
      answer: "When you book a seat, a parking slot nearby is assigned for easy access, reducing parking time.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900  to-gray-700 text-white p-4 font-sans">
      <div className="text-center mb-8">
        <button
          className={`px-4 py-2 font-semibold rounded-lg ${
            activeTab === "faq" ? "bg-yellow-500 text-gray-900" : "bg-gray-800 text-yellow-500"
          } transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg mx-2`}
          onClick={() => handleTabSwitch("faq")}
        >
          FAQ
        </button>
        <button
          className={`px-4 py-2 font-semibold rounded-lg ${
            activeTab === "contact" ? "bg-yellow-500 text-gray-900" : "bg-gray-800 text-yellow-500"
          } transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg mx-2`}
          onClick={() => handleTabSwitch("contact")}
        >
          Contact
        </button>
      </div>

      {activeTab === "faq" && (
        <div>
          <h1 className="text-4xl font-bold text-center mb-12 text-yellow-500 tracking-wider animate-pulse">
            <FontAwesomeIcon icon={faQuestionCircle} className="mr-3 text-yellow-400" />
            Frequently Asked Questions
          </h1>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-90 rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl"
              >
                <button
                  className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-300"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-yellow-400 transition-transform duration-300 ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFAQ === index && (
                  <p className="mt-4 text-gray-400 transition-opacity duration-500 ease-in-out bg-gray-900 bg-opacity-70 p-4 rounded-lg shadow-md">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div>
          <h1 className="text-4xl font-bold text-center mb-12 text-yellow-500 tracking-wider animate-pulse">
            <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-yellow-400" />
            Contact Us
          </h1>
          <div className="max-w-2xl mx-auto space-y-8">
            <form onSubmit={handleSubmit} className="space-y-4 bg-gradient-to-br from-gray-800 p-8 rounded-lg shadow-lg">
              <div>
                <label className="block text-gray-300 text-lg font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-2 p-2 rounded bg-gray-700 bg-opacity-80 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-lg font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-2 p-2 rounded bg-gray-700 bg-opacity-80 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-lg font-semibold">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full mt-2 p-2 rounded bg-gray-700 bg-opacity-80 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                  rows="5"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Send Message
              </button>
            </form>

            <div className="text-center text-gray-300 space-y-2">
              <p className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-yellow-400" />
                +1 (234) 567-890
              </p>
              <p className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-yellow-400" />
                123 Movie Street, Cinecity
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default FAQ;
