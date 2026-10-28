import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setLoading(false);
      setSubmitted(true);
      
      // Reset form after submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="contact-container">
      {/* Header Section */}
      <div className="contact-header">
        <h1>📞 Contact StockPlus Support</h1>
        <p>We're here to help you with any issues or questions</p>
      </div>

      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form-section">
          <div className="form-container">
            <h2>Get in Touch</h2>
            <p>Describe your issue and we'll get back to you soon</p>

            {submitted && (
              <div className="success-message">
                <span>✅</span>
                Thank you for your message! We'll contact you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Describe Your Problem *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Please describe your issue in detail..."
                  rows="5"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <div className="btn-loading">
                    <div className="spinner"></div>
                    Sending...
                  </div>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="contact-info-section">
          <div className="contact-info-card">
            <h3>📧 Contact Information</h3>
            
            <div className="contact-method">
              <div className="contact-icon">📧</div>
              <div className="contact-details">
                <h4>Email Support</h4>
                <p>support@stockplus.com</p>
                <p>help@stockplus.com</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h4>Phone Support</h4>
                <p>+91 1800-123-4567 (Toll Free)</p>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">🕒</div>
              <div className="contact-details">
                <h4>Support Hours</h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Emergency Support Only</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">📍</div>
              <div className="contact-details">
                <h4>Registered Office</h4>
                <p>StockPlus Financial Services Ltd.</p>
                <p>123 Financial District,</p>
                <p>Mumbai, Maharashtra - 400001</p>
              </div>
            </div>

            <div className="emergency-notice">
              <h4>🚨 Emergency Trading Issues</h4>
              <p>For urgent trading-related issues outside business hours, call our emergency line:</p>
              <p className="emergency-number">+91 98765 43210 (24/7)</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>❓ Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How long does it take to get a response?</h4>
            <p>We typically respond to all inquiries within 24 hours during business days.</p>
          </div>
          <div className="faq-item">
            <h4>What information should I include in my message?</h4>
            <p>Please include your account ID, the specific issue, and any relevant transaction details.</p>
          </div>
          <div className="faq-item">
            <h4>Do you provide phone support for technical issues?</h4>
            <p>Yes, we offer phone support for urgent technical and trading-related issues.</p>
          </div>
          <div className="faq-item">
            <h4>Can I visit your office for support?</h4>
            <p>We recommend contacting us first via phone or email to schedule an appointment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;