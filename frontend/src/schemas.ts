import { z } from 'zod';

export const GuestSchema = z.object({
  id: z.number(),
  group_id: z.number(),
  name: z.string(),
  created_at: z.string(),
});

export const GroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  invited_to_nikkah: z.boolean(),
  invited_to_wedding: z.boolean(),
  invited_to_henna: z.boolean(),
  max_guests_wedding: z.number(),
  max_guests_henna: z.number(),
  has_accepted_wedding: z.boolean(),
  has_accepted_henna: z.boolean(),
  has_rsvped_wedding: z.boolean(),
  has_rsvped_henna: z.boolean(),
  wedding_guests: z.array(GuestSchema),
  henna_guests: z.array(GuestSchema),
});

export const RSVPRequestSchema = z.object({
  event: z.enum(['wedding', 'henna']),
  accept: z.boolean(),
  guests: z.array(z.string()),
});

export const RSVPResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  group: GroupSchema.optional(),
});

export type Guest = z.infer<typeof GuestSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type RSVPRequest = z.infer<typeof RSVPRequestSchema>;
export type RSVPResponse = z.infer<typeof RSVPResponseSchema>;
