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

  useEffect(() => {
    const loadGroup = async () => {
      if (!token) return;
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

  if (!group) {
    return (
      <div className="event-page">
        <div className="error">Failed to load event details</div>
      </div>
    );
  }

  const nikkahEvent = EVENTS.nikkah;
  const weddingEvent = EVENTS.wedding;
  const showNikkah = group.invited_to_nikkah;
  const showWedding = group.invited_to_wedding;

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
  const date = showNikkah ? nikkahEvent.date : weddingEvent.date;
  const mapUrl = showNikkah ? nikkahEvent.mapUrl : weddingEvent.mapUrl;

  return (
    <div className="event-page">
      <div className="event-header">
        <h1 className="event-title">{pageTitle}</h1>
        <div className="decorative-line"></div>
        <p className="event-date">{date}</p>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="event-location"
        >
          📍 {venue}
        </a>
      </div>

      <div className="event-content">

        <section className="event-section">
          <h2>Schedule</h2>
          <ul className="event-list">
            {showNikkah && (
              <>
                <li>{nikkahEvent.time} - Nikkah Ceremony</li>
                <li>4pm - 5pm - Cocktail Hour</li>
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
          {/* <p className="event-detail">Formal Traditional Attire</p> */}
          TBD
        </section>
      </div>
    </div>
  );
}
