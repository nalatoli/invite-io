import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verifyGroup } from '../api';
import { type Group } from '../schemas';
import { EVENTS } from '../config/events';
import './EventPage.css';

export default function NikkahPage() {
  const { token } = useParams<{ token: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  // Public mode: no token present
  const isPublicMode = !token;

  useEffect(() => {
    const loadGroup = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await verifyGroup(token);
        setGroup(data);
      } catch (err) {
        console.error('Failed to load group', err);
      } finally {
        setLoading(false);
      }
    };
    loadGroup();
  }, [token]);

  if (loading) {
    return (
      <div className="event-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!isPublicMode && !group) {
    return (
      <div className="event-page">
        <div className="error">Failed to load event details</div>
      </div>
    );
  }

  const nikkahEvent = EVENTS.nikkah;
  const weddingEvent = EVENTS.wedding;

  // In public mode, show both Nikkah and Wedding info
  const showNikkah = isPublicMode || (group?.invited_to_nikkah ?? false);
  const showWedding = isPublicMode || (group?.invited_to_wedding ?? false);

  // Determine page title
  let pageTitle = '';
  if (showNikkah && showWedding) {
    pageTitle = 'Nikkah & Reception';
  } else if (showNikkah) {
    pageTitle = 'Nikkah Ceremony';
  } else if (showWedding) {
    pageTitle = 'Reception';
  }

  // Use the venue from whichever event is shown (they should be the same)
  const venue = showNikkah ? nikkahEvent.venue : weddingEvent.venue;
  const location = showNikkah ? nikkahEvent.location : weddingEvent.location;
  const date = showNikkah ? nikkahEvent.date : weddingEvent.date;
  const mapUrl = showNikkah ? nikkahEvent.mapUrl : weddingEvent.mapUrl;

  return (
    <div className="event-page">
      <div className="event-header">
        <h1 className="event-title">{pageTitle}</h1>
        <p className="event-guest-type">Mixed Event</p>
        <div className="decorative-line"></div>
        <p className="event-date">{date}</p>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="event-location"
        >
          📍 {venue}
          <span className="event-location-sub">{location}</span>
        </a>
        <p className="event-location-hint">Tap venue above to open it in Google Maps</p>
      </div>

      <div className="event-content">

        <section className="event-section">
          <h2>Schedule</h2>
          <ul className="event-list">
            {showNikkah && (
              <>
                <li>{nikkahEvent.time} - Nikkah Ceremony</li>
                <li>4:30pm - 6:00pm - Light Refreshments</li>
              </>
            )}
            {showWedding && (
              <>
                <li>{weddingEvent.time} - Reception & Dinner</li>
              </>
            )}
          </ul>
        </section>

        <section className="event-section">
          <h2>Dress Code</h2>
          <div className="summer-swatch-row">
            <div className="summer-swatch" />
            <span className="summer-swatch-label">Summer Colors Preffered</span>
          </div>
          <p style={{ color: `var(--primary-color)`, marginBottom: '0.4rem' }}>We kindly request our guests to dress in</p>
          <p style={{ marginBottom: '0.5rem', color: `var(--primary-color)`, fontStyle: 'italic' }}>Desi, Arab, or Western</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37', fontStyle: 'italic' }}>✦ Modest Formal Attire ✦</h3>
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
