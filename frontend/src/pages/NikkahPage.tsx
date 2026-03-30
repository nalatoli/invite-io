import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verifyGroup } from '../api';
import { type Group } from '../schemas';
import { EVENTS } from '../config/events';
import './EventPage.css';

export default function NikkahPage() {
  const { token } = useParams<{ token: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('DESI');
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
          <div className="summer-swatch-row">
            <div className="summer-swatch" />
            <span className="summer-swatch-label">Summer Colors Preffered</span>
          </div>
          {(() => {
            const categories = [
              {
                category: 'ARAB',
                women: [
                  { label: 'Abaya', q: 'abaya+wedding' },
                  { label: 'Kaftan', q: 'kaftan+wedding' },
                  { label: 'Jalabiya', q: 'jalabiya+wedding' },
                ],
                men: [],
              },
              {
                category: 'DESI',
                women: [
                  { label: 'Sharee', q: 'sharee+summer+bangladeshi+wedding' },
                  { label: 'Lehenga', q: 'lehenga+summer+bangladeshi+wedding' },
                  { label: 'Sharara', q: 'sharara+summer+bangladeshi+wedding' },
                  { label: 'Anarkali', q: 'anarkali+summer+bangladeshi+wedding' },
                ],
                men: [
                  { label: 'Sherwani', q: 'sherwani+summer+bangladeshi+wedding' },
                  { label: 'Johur Coat', q: 'nehru+jacket+summer+bangladeshi+wedding' },
                ],
              },
              {
                category: 'WESTERN',
                women: [
                  { label: 'Gown', q: 'formal+summer+gown+wedding' },
                ],
                men: [
                  { label: 'Tuxedo', q: 'tuxedo+summer+wedding' },
                  { label: 'Suit', q: 'formal+summer+suit+wedding' },
                ],
              },
            ];
            const selected = categories.find(c => c.category === selectedCategory);
            return (
              <div className="dress-code-categories">
                <div className="attire-bar">
                  {categories.map(({ category }, i, arr) => (
                    <>
                      <button
                        key={category}
                        className={`attire-bar-item dress-code-category-btn${selectedCategory === category ? ' active' : ''}`}
                        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      >
                        {category}
                      </button>
                      {i < arr.length - 1 && <span key={`sep-${i}`} className="attire-bar-sep" />}
                    </>
                  ))}
                </div>
                {selected && (
                  <div className="dress-code-gender-pills" key={selected.category}>
                    {[{ gender: 'Women', items: selected.women }, { gender: 'Men', items: selected.men }].filter(({ items }) => items.length > 0).map(({ gender, items }) => (
                      <div key={gender} className="dress-code-gender-group">
                        <div className="attire-bar">
                          {items.map(({ label, q }, i, arr) => (
                            <>
                              <a
                                key={label}
                                className="attire-bar-item"
                                href={`https://www.google.com/search?q=${q}&tbm=isch`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {label}
                              </a>
                              {i < arr.length - 1 && <span key={`sep-${i}`} className="attire-bar-sep" />}
                            </>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
          <p className="attire-help-text">Tap an attire above to see examples</p>
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
