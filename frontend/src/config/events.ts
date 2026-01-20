export interface EventInfo {
  name: string;
  date: string;
  time: string;
  venue: string;
  mapUrl: string;
}

export const EVENTS: Record<'nikkah' | 'wedding' | 'henna', EventInfo> = {
  nikkah: {
    name: 'Nikkah',
    date: 'Friday, July 17, 2026',
    time: '3pm - 4pm',
    venue: 'Marina Del Rey',
    mapUrl: 'https://maps.app.goo.gl/iTfg5qRv8xPTs2v1A',
  },
  wedding: {
    name: 'Reception',
    date: 'Friday, July 17, 2026',
    time: '5pm - 9pm',
    venue: 'Marina Del Rey',
    mapUrl: 'https://maps.app.goo.gl/iTfg5qRv8xPTs2v1A',
  },
  henna: {
    name: 'Henna',
    date: 'Friday, [Date]',
    time: '[Start Time] - [End Time]',
    venue: '[Venue Name]',
    mapUrl: 'https://maps.google.com/?q=[Venue+Name]',
  },
};
