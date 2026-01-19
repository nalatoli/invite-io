import { type Group, type RSVPRequest, type RSVPResponse, GroupSchema, RSVPResponseSchema } from './schemas';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function verifyGroup(token: string): Promise<Group> {
  const response = await fetch(`${API_BASE_URL}/groups/verify/${token}`);
  if (!response.ok) {
    throw new Error('Invalid invitation token');
  }
  const data = await response.json();
  return GroupSchema.parse(data);
}

export async function submitRSVP(token: string, rsvpData: RSVPRequest): Promise<RSVPResponse> {
  const response = await fetch(`${API_BASE_URL}/groups/rsvp/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rsvpData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to submit RSVP');
  }

  return RSVPResponseSchema.parse(data);
}

export async function getRSVPStatus(token: string): Promise<Group> {
  const response = await fetch(`${API_BASE_URL}/groups/status/${token}`);
  if (!response.ok) {
    throw new Error('Failed to fetch RSVP status');
  }
  const data = await response.json();
  return GroupSchema.parse(data);
}
