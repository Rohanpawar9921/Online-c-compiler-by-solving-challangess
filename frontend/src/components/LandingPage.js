// src/components/LandingPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1><span className="highlight">C Compiler</span> Web App</h1>
          <p>Write, compile, and track your progress in C programming — all in your browser.</p>
          <div className="cta-buttons">
            <button onClick={handleLogin} className="btn login-btn">Login</button>
            <button onClick={handleRegister} className="btn register-btn">Register</button>
          </div>
        </div>
      </section>

      {/* Services We Offer */}
      <section className="services">
        <h2>Our Core Offerings</h2>
        <div className="cards">
          <div className="card">
            <h3>Interactive Challenges</h3>
            <p>Test your skills through real-world C problems and level up with every success.</p>
          </div>
          <div className="card">
            <h3>Badges & Rewards</h3>
            <p>Earn badges for completing challenges and showcase your achievements.</p>
          </div>
          <div className="card">
            <h3>Progress Dashboard</h3>
            <p>Track your learning journey with visual progress metrics and milestones.</p>
          </div>
          <div className="card">
            <h3>Real-Time Compilation</h3>
            <p>Compile and run your C code with lightning-fast cloud infrastructure.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Code</h3>
            <p>Write code in the editor with syntax highlighting and smart tips.</p>
          </div>
          <div className="step">
            <h3>2. Compile</h3>
            <p>Click 'Run' to compile with zero setup using our secure cloud engine.</p>
          </div>
          <div className="step">
            <h3>3. Progress</h3>
            <p>View your stats, completed challenges, and achievements in your dashboard.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Users Say</h2>
        <div className="testimonial-container">
          <div className="testimonial">
            <p>"Absolutely love this app! It's my go-to for C coding practice and interviews."</p>
            <span>- Priya, Software Engineer</span>
          </div>
          <div className="testimonial">
            <p>"Perfect platform for learning and tracking progress. The challenges are awesome!"</p>
            <span>- Rahul, CS Student</span>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="get-started">
        <h2>Start Your C Programming Journey</h2>
        <p>Join our community and become a C pro — from beginner to advanced.</p>
        <div className="cta-buttons">
          <button onClick={handleLogin} className="btn login-btn">Login</button>
          <button onClick={handleRegister} className="btn register-btn">Register</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div>
          <p>&copy; 2025 C Compiler Web App. Crafted with 💻 and ☕ for coders.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
