import React from "react";
import { DatePicker } from "../components/DatePicker";
import { TimePicker } from "../components/TimePicker";
import { DateTimePicker } from "../components/DateTimePicker";
import "./App.css";

const Home: React.FC = () => {
  return (
    <div className="App">
      <header className="header">
        <h1>CK Marketing & Automation</h1>
        <p>We help businesses generate leads & automate follow-ups</p>
      </header>

      <section className="services">
        <h2>Our Services</h2>
        <ul>
          <li>Lead Generation (Meta & Google Ads)</li>
          <li>WhatsApp & Email Automation</li>
          <li>CRM & Funnel Setup</li>
        </ul>
      </section>

      <section className="time-viewer">
        <h2>Time Viewer</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
          <div>
            <label>Date Picker:</label>
            <DatePicker />
          </div>
          <div>
            <label>Time Picker:</label>
            <TimePicker />
          </div>
          <div>
            <label>Date Time Picker:</label>
            <DateTimePicker />
          </div>
        </div>
      </section>

      <section className="contact">
        <h2>Contact</h2>
        <p>Email: ayush</p>
        <p>WhatsApp: +91XXXXXXXXXX</p>
      </section>

      <footer className="footer">
        <p>© 2025 CK Marketing</p>
      </footer>
    </div>
  );
};

export default Home;
