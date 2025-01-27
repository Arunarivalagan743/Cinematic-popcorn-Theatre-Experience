
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faChevronDown, faEnvelope, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import axios from 'axios';
const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [activeTab, setActiveTab] = useState("faq");
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [questionData, setQuestionData] = useState({ userQuestion: '', userEmail: '' });

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

  const handleQuestionChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };



  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://mern-auth-movie.onrender.com/api/faq/ask', {
        userQuestion: questionData.userQuestion,
        userEmail: questionData.userEmail,
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error submitting your question!',
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/contact/submit', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error submitting your message!',
      });
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-50 text-white p-4 font-sans">
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

          {/* Ask a Question Form */}
          <div className="max-w-2xl mx-auto mt-12 space-y-4">
            <h2 className="text-2xl font-semibold text-center text-yellow-500">Ask a Question</h2>
            <form onSubmit={handleQuestionSubmit} className="space-y-4 bg-gradient-to-br from-purple-300 to-blue-200 p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faUser} className="text-gray-300" />
                <input
                  type="email"
                  name="userEmail"
                  value={questionData.userEmail}
                  onChange={handleQuestionChange}
                  className="w-full mt-2 p-2 rounded bg-gray-700 bg-opacity-80 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-gray-300" />
                <textarea
                  name="userQuestion"
                  value={questionData.userQuestion}
                  onChange={handleQuestionChange}
                  className="w-full mt-2 p-2 rounded bg-gray-700 bg-opacity-80 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                  rows="4"
                  placeholder="Your Question"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Submit Question
              </button>
            </form>
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
            <form onSubmit={handleSubmit} className="space-y-4 bg-gradient-to-br from-purple-300 to-blue-200 p-8 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faUser} className="text-gray-300" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-2 p-2 rounded bg-gray-700 bg-opacity-80 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-300" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-2 p-2 rounded bg-gray-700 bg-opacity-80 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-gray-300" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full mt-2 p-2 rounded bg-gray-700 bg-opacity-80 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                  rows="4"
                  placeholder="Your Message"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FAQ;
