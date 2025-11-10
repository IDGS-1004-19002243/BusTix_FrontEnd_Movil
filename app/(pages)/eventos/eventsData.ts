export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: number;
  category: string;
  availableTickets: number;
}

export const initialEvents: Event[] = [
  {
    id: '1',
    name: 'Concierto de Rock',
    date: '2025-11-15',
    time: '20:00',
    location: 'Estadio Nacional',
    description: 'Un concierto épico con las mejores bandas de rock.',
    price: 50,
    category: 'Música',
    availableTickets: 500,
  },
  {
    id: '2',
    name: 'Festival de Jazz',
    date: '2025-11-22',
    time: '19:00',
    location: 'Parque Central',
    description: 'Disfruta de jazz en vivo bajo las estrellas.',
    price: 30,
    category: 'Música',
    availableTickets: 300,
  },
  {
    id: '3',
    name: 'Teatro Musical',
    date: '2025-11-30',
    time: '18:00',
    location: 'Teatro Principal',
    description: 'Una producción musical inolvidable.',
    price: 40,
    category: 'Teatro',
    availableTickets: 200,
  },
  {
    id: '4',
    name: 'Ballet Clásico',
    date: '2025-11-10',
    time: '17:00',
    location: 'Teatro de la Ópera',
    description: 'Elegancia y gracia en el escenario.',
    price: 35,
    category: 'Danza',
    availableTickets: 150,
  },
  {
    id: '5',
    name: 'Stand Up Comedy',
    date: '2025-11-18',
    time: '21:00',
    location: 'Comedy Club',
    description: 'Risas garantizadas con los mejores comediantes.',
    price: 25,
    category: 'Comedia',
    availableTickets: 30,
  },
  {
    id: '6',
    name: 'Ópera Italiana',
    date: '2025-11-25',
    time: '19:30',
    location: 'Teatro de la Ópera',
    description: 'Las mejores arias de la ópera italiana.',
    price: 60,
    category: 'Ópera',
    availableTickets: 15,
  },
];