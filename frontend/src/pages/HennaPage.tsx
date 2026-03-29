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
        </a>
      </div>

      <div className="event-content">
        <section className="event-section">
          <h2>Schedule</h2>
          <ul className="event-list">
            <li>5pm - 7pm - Gaye Holud</li>
            <li>7pm - 10pm - Henna</li>
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
          <div className="attire-bar">
            {['Sharee', 'Lehenga', 'Sharara', 'Garara', 'Anarkali'].map((style, i, arr) => (
              <>
                <a
                  key={style}
                  className="attire-bar-item"
                  href={`https://www.google.com/search?q=${style}+bangladeshi+wedding&tbm=isch`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {style}
                </a>
                {i < arr.length - 1 && <span key={`sep-${i}`} className="attire-bar-sep" />}
              </>
            ))}
          </div>
          <p className="attire-help-text">Tap an attire above to see examples</p>
        </section>
      </div>

      <footer className="event-footer">
        <p>Please no boxed gifts at the event</p>
        <a href="https://www.amazon.com/wedding/guest-view/JVLKC30FV72B" target="_blank" rel="noopener noreferrer">
          🎁 Amazon Registry
        </a>
      </footer>
    </div>
  );
}
