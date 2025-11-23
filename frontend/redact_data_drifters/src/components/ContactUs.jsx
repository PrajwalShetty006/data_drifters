import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

const ContactUs = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that all fields are filled
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return; // Don't show popup if any field is empty
    }
    
    setShowSuccessPopup(true);
    // Clear form inputs
    setFormData({
      name: "",
      email: "",
      message: "",
    });
    // Auto-close after 3 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  return (
    <main
      id="ContactUs"
      className="flex lg:mt-0 flex-col lg:flex-row items-center justify-between min-h-[calc(110vh-6rem)] px-6 lg:px-20 bg-black relative z-10 overflow-hidden"
    >
      {/* Background Spline Scene - at bottom, full screen width */}
      <div 
        className="absolute pointer-events-none z-0"
        style={{
          bottom: '-20vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '70vh',
        }}
      >
        <Spline 
          scene="https://prod.spline.design/lmeh5sMeik3EZauW/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Left column: Contact Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-start justify-center space-y-6 relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-wider">
          Contact Us
        </h1>

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Message
            </label>
            <textarea
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Right column: Spline 3D Scene */}
      <div
        className="relative w-full lg:w-1/2 mt-10 lg:mt-0 flex justify-center z-10" // added margin-left
        style={{
          transform: "scale(0.9)",
          width: "1000px",
          height: "600px",
          left: "20%",
        }}
      >
        <Spline
          data-aos="fade-zoom-in"
          data-aos-easing="ease-in-back"
          data-aos-delay="300"
          data-aos-offset="0"
          data-aos-duration="1000"
          scene="https://prod.spline.design/JkRoVafPgHZagVLA/scene.splinecode"
        />
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity"
          onClick={() => setShowSuccessPopup(false)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Successfully Submitted!
              </h2>
              <p className="text-gray-400 mb-6">
                Your message has been sent successfully. We'll get back to you soon.
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ContactUs;