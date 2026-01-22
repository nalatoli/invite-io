import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verifyGroup } from '../api';

export default function DefaultRedirect() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroup = async () => {
      if (!token) return;
      try {
        await verifyGroup(token);
      } catch (err) {
        console.error('Failed to load group', err);
      } finally {
        setLoading(false);
      }
    };
    loadGroup();
  }, [token]);

  if (loading || !token) {
    return null;
  }

  return <Navigate to={`/${token}/rsvp`} replace />;

  // if (!group) {
  //   return <Navigate to={`/${token}/rsvp`} replace />;
  // }

  // // Redirect to the first available event tab
  // if (group.invited_to_nikkah || group.invited_to_wedding) {
  //   return <Navigate to={`/${token}/nikkah`} replace />;
  // }

  // if (group.invited_to_henna) {
  //   return <Navigate to={`/${token}/henna`} replace />;
  // }

  // // Default to RSVP if no events are available
  // return <Navigate to={`/${token}/rsvp`} replace />;
}
