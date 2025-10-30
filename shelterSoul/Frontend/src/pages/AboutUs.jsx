import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About Shelter Soul</h1>
        <p>Giving every pet a chance to find a loving home 🐾</p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At <strong>Shelter Soul</strong>, we believe every pet deserves a second chance.
          Our platform connects caring adopters with animals in need, ensuring they
          find the perfect forever home.
        </p>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <img src="/team1.jpg" alt="Team Member 1" />
            <h3>Rutuja Mane</h3>
            <p>Founder & Developer</p>
          </div>
          <div className="team-card">
            <img src="/team2.jpg" alt="Team Member 2" />
            <h3>Priya Sharma</h3>
            <p>Pet Adoption Specialist</p>
          </div>
          <div className="team-card">
            <img src="/team3.jpg" alt="Team Member 3" />
            <h3>Arjun Patel</h3>
            <p>Community Manager</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
