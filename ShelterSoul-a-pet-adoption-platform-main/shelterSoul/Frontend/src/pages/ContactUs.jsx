import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-container">
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you — reach out anytime!</p>
      </section>

      <section className="contact-content">
        <div className="contact-form">
          <h2>Send us a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="contact-info">
          <h2>Our Info</h2>
          <p><strong>Email:</strong> support@sheltersoul.com</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Address:</strong> Pune, Maharashtra, India</p>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
