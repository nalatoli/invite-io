import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submitRSVP, getRSVPStatus } from '../api';
import { type Group } from '../schemas';
import { EVENTS } from '../config/events';
import './RSVPPage.css';

type EventType = 'wedding' | 'henna';

interface EventRSVP {
  accepting: boolean;
  guests: string[];
}

export default function RSVPPage() {
  const { token } = useParams<{ token: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<EventType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<EventType | null>(null);

  const [weddingRsvp, setWeddingRsvp] = useState<EventRSVP>({
    accepting: true,
    guests: [],
  });

  const [hennaRsvp, setHennaRsvp] = useState<EventRSVP>({
    accepting: true,
    guests: [],
  });

  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

  useEffect(() => {
    const loadRSVPStatus = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const data = await getRSVPStatus(token);
        setGroup(data);

        setWeddingRsvp({
          accepting: data.has_rsvped_wedding ? data.has_accepted_wedding : true,
          guests: data.wedding_guests.map(g => g.name),
        });

        setHennaRsvp({
          accepting: data.has_rsvped_henna ? data.has_accepted_henna : true,
          guests: data.henna_guests.map(g => g.name),
        });
      } catch {
        setError('Failed to load RSVP status');
      } finally {
        setLoading(false);
      }
    };

    loadRSVPStatus();
  }, [token]);

  const handleSubmit = async (event: EventType) => {
    if (!token || !group) return;

    setError(null);
    setSuccess(null);
    setSubmitting(event);

    const rsvpData = event === 'wedding' ? weddingRsvp : hennaRsvp;

    try {
      const response = await submitRSVP(token, {
        event,
        accept: rsvpData.accepting,
        guests: rsvpData.accepting ? rsvpData.guests.filter(g => g.trim() !== '') : [],
      });

      setSuccess(event);
      if (response.group) {
        setGroup(response.group);
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : `Failed to submit RSVP for ${event}`);
    } finally {
      setSubmitting(null);
    }
  };

  const addGuest = (event: EventType) => {
    if (event === 'wedding') {
      setWeddingRsvp({ ...weddingRsvp, guests: [...weddingRsvp.guests, ''] });
    } else {
      setHennaRsvp({ ...hennaRsvp, guests: [...hennaRsvp.guests, ''] });
    }
  };

  const removeGuest = (event: EventType, index: number) => {
    if (event === 'wedding') {
      setWeddingRsvp({
        ...weddingRsvp,
        guests: weddingRsvp.guests.filter((_, i) => i !== index),
      });
    } else {
      setHennaRsvp({
        ...hennaRsvp,
        guests: hennaRsvp.guests.filter((_, i) => i !== index),
      });
    }
  };

  const updateGuest = (event: EventType, index: number, name: string) => {
    if (event === 'wedding') {
      const newGuests = [...weddingRsvp.guests];
      newGuests[index] = name;
      setWeddingRsvp({ ...weddingRsvp, guests: newGuests });
    } else {
      const newGuests = [...hennaRsvp.guests];
      newGuests[index] = name;
      setHennaRsvp({ ...hennaRsvp, guests: newGuests });
    }
  };

  const setAccepting = (event: EventType, accepting: boolean) => {
    if (event === 'wedding') {
      setWeddingRsvp({ accepting, guests: accepting ? weddingRsvp.guests : [] });
    } else {
      setHennaRsvp({ accepting, guests: accepting ? hennaRsvp.guests : [] });
    }
  };

  if (loading) {
    return (
      <div className="rsvp-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="rsvp-page">
        <div className="error-message">Invalid invitation</div>
      </div>
    );
  }

  const renderEventSection = (
    event: EventType,
    title: string,
    linkPath: string,
    rsvp: EventRSVP,
    maxGuests: number,
    hasRsvped: boolean,
    hasAccepted: boolean,
    showCombined: boolean = false
  ) => {
    const canAddGuests = maxGuests !== 0;
    const guestLimit = maxGuests === -1 ? 'unlimited' : maxGuests;
    const hasEmptyGuests = rsvp.accepting && rsvp.guests.some(guest => guest.trim() === '');

    // If showing combined nikkah & wedding, calculate combined time
    let displayDate = '';
    let displayTime = '';

    if (showCombined) {
      const nikkahEvent = EVENTS.nikkah;
      const weddingEvent = EVENTS.wedding;
      displayDate = nikkahEvent.date;

      // Extract start time from nikkah and end time from wedding
      const nikkahStartTime = nikkahEvent.time.split(' - ')[0];
      const weddingEndTime = weddingEvent.time.split(' - ')[1] || weddingEvent.time.split(' - ')[0];
      displayTime = `${nikkahStartTime} - ${weddingEndTime}`;
    } else {
      const eventInfo = EVENTS[event];
      displayDate = eventInfo.date;
      displayTime = eventInfo.time;
    }

    console.log(success)
    console.log(guestLimit)
    console.log(displayDate)
    console.log(displayTime)

    return (
      <div className="event-rsvp-section">
        <h2 className="event-rsvp-title">
          <Link to={linkPath} className="event-title-link">
            {title}
            <span className="event-rsvp-guest-type">{event === 'henna' ? 'Women Only' : 'Mixed Event'}</span>
            <span className="event-title-link-hint">View Details</span>
          </Link>
        </h2>

        {/* <div className="event-info">
          <div className="event-info-item">
            <span className="event-info-label">Date:</span>
            <span className="event-info-value">{displayDate}</span>
          </div>
          <div className="event-info-item">
            <span className="event-info-label">Time:</span>
            <span className="event-info-value">{displayTime}</span>
          </div>
        </div> */}

        {hasRsvped && editingEvent !== event ? (
          <div className="rsvp-submitted-content">
            <button
              className={`rsvp-status-badge clickable ${!hasAccepted ? 'declined' : ''}`}
              onClick={() => setEditingEvent(event)}
            >
              {hasAccepted ? 'RSVP Submitted - Attending' : 'RSVP Submitted - Declined'}
              <span className="change-rsvp-hint">Tap to change</span>
            </button>
            {hasAccepted && rsvp.guests.length > 0 && (
              <div className="confirmed-guests">
                <p className="confirmed-guests-label">Confirmed guests:</p>
                <ul className="confirmed-guests-list">
                  {rsvp.guests.map((guest, index) => (
                    <li key={index}>{guest}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="rsvp-form-content">
            <div className="rsvp-question">
              <h3>Will you be attending?</h3>
              <div className="attendance-toggle">
                <button
                  type="button"
                  className={`attendance-option ${rsvp.accepting ? 'selected' : ''}`}
                  onClick={() => setAccepting(event, true)}
                >
                  <span className="attendance-icon">✓</span>
                  <span className="attendance-text">Joyfully Accept</span>
                </button>
                <button
                  type="button"
                  className={`attendance-option decline ${!rsvp.accepting ? 'selected' : ''}`}
                  onClick={() => setAccepting(event, false)}
                >
                  <span className="attendance-icon">✕</span>
                  <span className="attendance-text">Regretfully Decline</span>
                </button>
              </div>
            </div>

            {rsvp.accepting && canAddGuests && (
              <div className="guests-section">
                <h3>
                  Guest Names
                  {/* {maxGuests > 0 && (
                    <span className="guest-limit"> (Maximum: {guestLimit})</span>
                  )} */}
                </h3>
                <p className="guest-instruction">
                  Please enter the names of all guests attending.
                </p>

                <div className="guests-list">
                  {rsvp.guests.map((guest, index) => (
                    <div key={index} className="guest-input-row">
                      <input
                        type="text"
                        value={guest}
                        onChange={(e) => updateGuest(event, index, e.target.value)}
                        placeholder={`Guest name`}
                        className="guest-input"
                      />
                      <button
                        type="button"
                        onClick={() => removeGuest(event, index)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {(maxGuests === -1 || rsvp.guests.length < maxGuests) && (
                  <button
                    type="button"
                    onClick={() => addGuest(event)}
                    className="btn-add-guest"
                  >
                    + Add Guest
                  </button>
                )}
              </div>
            )}

            <div className="rsvp-buttons">
              {hasRsvped && (
                <button
                  onClick={() => setEditingEvent(null)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  handleSubmit(event);
                  setEditingEvent(null);
                }}
                disabled={submitting !== null || hasEmptyGuests}
                className="btn-submit"
              >
                {submitting === event ? 'Submitting...' : hasRsvped ? 'Update RSVP' : `Submit ${title} RSVP`}
              </button>
            </div>

            {/* {success === event && (
              <div className="success-message">
                Your RSVP for {title} has been submitted successfully!
              </div>
            )} */}
          </div>
        )}
      </div>
    );
  };

  // Determine if showing combined nikkah & wedding
  const showCombinedNikkahWedding = group.invited_to_nikkah && group.invited_to_wedding;
  const showWeddingOnly = group.invited_to_wedding && !group.invited_to_nikkah;

  const hasMultipleEvents =
    (showCombinedNikkahWedding || showWeddingOnly ? 1 : 0) + (group.invited_to_henna ? 1 : 0) > 1;

  return (
    <div className="rsvp-page">
      <div className="rsvp-header">
        {/* <h1 className="rsvp-title">RSVP</h1> */}
        <p className="rsvp-subtitle">Dear {group.name},</p>
        <p className="rsvp-description">
          We would be honored by your presence at our wedding celebrations.
          {hasMultipleEvents && ' Please RSVP for each event separately.'}
        </p>
      </div>

      <div className="rsvp-events">
        {showCombinedNikkahWedding && renderEventSection(
          'wedding',
          'Nikkah & Reception',
          `/${token}/nikkah`,
          weddingRsvp,
          group.max_guests_wedding,
          group.has_rsvped_wedding,
          group.has_accepted_wedding,
          true
        )}

        {showWeddingOnly && renderEventSection(
          'wedding',
          'Reception',
          `/${token}/nikkah`,
          weddingRsvp,
          group.max_guests_wedding,
          group.has_rsvped_wedding,
          group.has_accepted_wedding,
          false
        )}

        {group.invited_to_henna && renderEventSection(
          'henna',
          'Henna',
          `/${token}/henna`,
          hennaRsvp,
          group.max_guests_henna,
          group.has_rsvped_henna,
          group.has_accepted_henna,
          false
        )}
      </div>

      {error && <div className="error-message-global">{error}</div>}
    </div>
  );
}
