import { EVENTS } from '../config/events';
import './EventPage.css';

export default function HennaPage() {
  const hennaEvent = EVENTS.henna;

  return (
    <div className="event-page">
      <div className="event-header">
        <h1 className="event-title">{hennaEvent.name}</h1>
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
            <li>{hennaEvent.time} - Henna Celebration</li>
          </ul>
        </section>

        <section className="event-section">
          <h2>Dress Code</h2>
          {/* <p className="event-detail">Colorful Traditional Attire</p>
          <p className="event-detail">Bright colors encouraged!</p> */}
          TBD
        </section>
      </div>
    </div>
  );
}
