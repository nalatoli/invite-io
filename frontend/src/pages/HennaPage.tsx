import { EVENTS } from '../config/events';
import './EventPage.css';

export default function HennaPage() {
  const hennaEvent = EVENTS.henna;

  return (
    <div className="event-page">
      <div className="event-header">
        <h1 className="event-title">{hennaEvent.name}</h1>
        <p className="event-guest-type">Women Only</p>
        <div className="decorative-line"></div>
        <p className="event-date">{hennaEvent.date}</p>
        {/* <p className="event-date">{hennaEvent.time}</p> */}
        <a
          href={hennaEvent.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="event-location"
        >
          📍 {hennaEvent.venue}
          <span className="event-location-sub">{hennaEvent.location}</span>
        </a>
        <p className="event-location-hint">Tap venue above to open it in Google Maps</p>
      </div>

      <div className="event-content">
        <section className="event-section">
          <h2>Schedule</h2>
          <ul className="event-list">
            <li>5:00pm - 7:00pm - Gaye Holud</li>
            <li>7:00pm - 10:00pm - Henna</li>
          </ul>
        </section>

        <section className="event-section">
          <h2>Dress Code</h2>
          <div className="dress-code-colors">
            <div className="color-swatch-item">
              <div className="color-swatch" style={{ background: '#1a5c2a' }} />
              <span>Dark Green</span>
            </div>
            <div className="color-swatch-item">
              <div className="color-swatch" style={{ background: '#D4AF37' }} />
              <span>Gold</span>
            </div>
            <div className="color-swatch-item">
              <div className="color-swatch" style={{ background: '#F5C518' }} />
              <span>Yellow</span>
            </div>
            <div className="color-swatch-item">
              <div className="color-swatch" style={{ background: '#E07020' }} />
              <span>Orange</span>
            </div>
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", color: `var(--primary-color)`, fontStyle: 'italic' }}> Please embrace the festivities with </p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37', fontStyle: 'italic' }}>✦ Desi Attire ✦</h3>
        </section>
      </div>

      <footer className="event-footer">
        <p>We kindly request that no boxed gifts be brought to these events</p>
        <a href="https://www.amazon.com/wedding/guest-view/JVLKC30FV72B" target="_blank" rel="noopener noreferrer">
          🎁 Amazon Registry
        </a>
      </footer>
    </div>
  );
}
