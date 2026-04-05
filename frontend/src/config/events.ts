export interface EventInfo {
  name: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  mapUrl: string;
}

export const EVENTS: Record<'nikkah' | 'wedding' | 'henna', EventInfo> = {
  nikkah: {
    name: 'Nikkah',
    date: 'Friday, July 17, 2026',
    time: '3pm - 4pm',
    venue: 'Marina Del Rey',
    location: 'The Bronx, NY',
    mapUrl: 'https://maps.app.goo.gl/iTfg5qRv8xPTs2v1A',
  },
  wedding: {
    name: 'Reception',
    date: 'Friday, July 17, 2026',
    time: '5pm - 9pm',
    venue: 'Marina Del Rey',
    location: 'The Bronx, NY',
    mapUrl: 'https://maps.app.goo.gl/iTfg5qRv8xPTs2v1A',
  },
  henna: {
    name: 'Gaye Holud & Henna',
    date: 'Saturday, July 11, 2026',
    time: '5pm - 10pm',
    venue: 'MAS Youth Center',
    location: 'Brooklyn, NY',
    mapUrl: 'https://maps.app.goo.gl/ny5sgoXoJuSSueuu6',
  },
};
