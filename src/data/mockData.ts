import { Movie, Cinema, ShowTime, SnackItem } from '../types';

export const CITIES = [
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Delhi-NCR',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
];

export const POPULAR_CITIES = [
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200&auto=format&fit=crop&q=80', cinemasCount: 142 },
  { name: 'Bengaluru', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=200&auto=format&fit=crop&q=80', cinemasCount: 118 },
  { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=200&auto=format&fit=crop&q=80', cinemasCount: 95 },
  { name: 'Delhi-NCR', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200&auto=format&fit=crop&q=80', cinemasCount: 160 },
  { name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200&auto=format&fit=crop&q=80', cinemasCount: 88 },
  { name: 'Kolkata', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&auto=format&fit=crop&q=80', cinemasCount: 74 },
  { name: 'Pune', image: 'https://images.unsplash.com/photo-1631049035300-81f185703f56?w=200&auto=format&fit=crop&q=80', cinemasCount: 65 },
  { name: 'Ahmedabad', image: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=200&auto=format&fit=crop&q=80', cinemasCount: 52 },
];

export const GENRES = [
  'All',
  'Action',
  'Sci-Fi',
  'Drama',
  'Thriller',
  'Comedy',
  'Adventure',
  'Animation',
];

export const LANGUAGES = ['All', 'English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'];

export const MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Interstellar Odyssey: Beyond the Horizon',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    rating: '9.4/10 (145K votes)',
    censorRating: 'UA',
    duration: '2h 52m',
    releaseDate: '28 Sep 2026',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'When a catastrophic climate collapse threatens humanity, a group of elite astronauts venture through a newly discovered wormhole in search of a habitable sanctuary among distant star systems.',
    director: 'Christopher Nolan Jr.',
    cast: [
      { name: 'Matthew Cooper', role: 'Capt. Joseph Vance', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      { name: 'Jessica Chastain', role: 'Dr. Amelia Brand', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { name: 'Michael Caine', role: 'Professor John', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
    ],
    formats: ['2D', 'IMAX 3D', '4DX', 'Dolby Atmos'],
    trending: true,
    featured: true,
    cities: ['Mumbai', 'Bengaluru', 'Hyderabad', 'Delhi-NCR', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'],
  },
  {
    id: 'm2',
    title: 'Cyber Ronin: Neon Vengeance',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    language: 'English',
    rating: '8.9/10 (98K votes)',
    censorRating: 'A',
    duration: '2h 15m',
    releaseDate: '01 Oct 2026',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'In a dystopian mega-city ruled by rogue artificial intelligence syndicates, an augmented cyberpunk mercenary unleashes high-octane martial arts justice to save the last human enclave.',
    director: 'Kenji Takahashi',
    cast: [
      { name: 'Hiroyuki Sanada', role: 'Kaito Shogun', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
      { name: 'Rinko Kikuchi', role: 'Nova-9', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
    ],
    formats: ['2D', 'IMAX 3D', '4DX'],
    trending: true,
    featured: false,
    cities: ['Mumbai', 'Bengaluru', 'Hyderabad', 'Delhi-NCR', 'Pune'],
  },
  {
    id: 'm3',
    title: 'The Crimson Throne',
    genre: ['Drama', 'Adventure'],
    language: 'Hindi',
    rating: '9.1/10 (210K votes)',
    censorRating: 'UA',
    duration: '3h 04m',
    releaseDate: '15 Oct 2026',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'An epic historical saga of fierce rivalries, royal betrayals, and unbreakable honor across the magnificent palaces and battlefields of 17th-century medieval empires.',
    director: 'S. S. Rajamouli',
    cast: [
      { name: 'Prabhas Varma', role: 'Maharaj Vikramaditya', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' },
      { name: 'Deepika Sen', role: 'Rani Samyukta', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
    ],
    formats: ['2D', 'IMAX 3D', 'Dolby Atmos'],
    trending: true,
    featured: true,
    cities: ['Mumbai', 'Bengaluru', 'Hyderabad', 'Delhi-NCR', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'],
  },
  {
    id: 'm4',
    title: 'Midnight in Paris with Alchemists',
    genre: ['Comedy', 'Romance', 'Fantasy'],
    language: 'English',
    rating: '8.6/10 (75K votes)',
    censorRating: 'UA',
    duration: '1h 58m',
    releaseDate: '05 Oct 2026',
    poster: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'A quirky time-traveling novelist accidentally stumbles into secret midnight salons in 1920s Paris, rubbing shoulders with legendary artists, mad scientists, and mystical alchemists.',
    director: 'Amelie Poulain',
    cast: [
      { name: 'Timothée Chalamet', role: 'Julian Vane', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80' },
      { name: 'Marion Cotillard', role: 'Madame Genevieve', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
    ],
    formats: ['2D', 'Dolby Atmos'],
    trending: false,
    featured: false,
    cities: ['Mumbai', 'Bengaluru', 'Delhi-NCR', 'Kolkata'],
  },
  {
    id: 'm5',
    title: 'Apex Predator: Deep Abyss',
    genre: ['Thriller', 'Action', 'Adventure'],
    language: 'Telugu',
    rating: '8.8/10 (82K votes)',
    censorRating: 'UA',
    duration: '2h 28m',
    releaseDate: '10 Oct 2026',
    poster: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'Deep sea marine biologists exploring the Mariana Trench discover an uncharted prehistoric ecosystem teeming with colossal predators that threaten global coastal cities.',
    director: 'Atlee Kumar',
    cast: [
      { name: 'Allu Arjun', role: 'Commander Surya', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      { name: 'Samantha Ruth', role: 'Dr. Maya', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
    ],
    formats: ['2D', 'IMAX 3D', '4DX', 'Dolby Atmos'],
    trending: true,
    featured: false,
    cities: ['Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai'],
  },
  {
    id: 'm6',
    title: 'The Quantum Heist',
    genre: ['Thriller', 'Action', 'Comedy'],
    language: 'Tamil',
    rating: '8.5/10 (64K votes)',
    censorRating: 'UA',
    duration: '2h 10m',
    releaseDate: '20 Oct 2026',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'A brilliant team of eccentric hackers and ex-magicians plan an impossible heist to steal quantum encryption keys from a floating casino in Singapore.',
    director: 'Lokesh Kanagaraj',
    cast: [
      { name: 'Vijay Thalapathy', role: 'Leo Das', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
      { name: 'Nayanthara', role: 'Aisha', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
    ],
    formats: ['2D', 'IMAX 3D', 'Dolby Atmos'],
    trending: false,
    featured: false,
    cities: ['Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai'],
  },
];

export const CINEMAS: Cinema[] = [
  // Mumbai Cinemas
  {
    id: 'c1',
    name: 'PVR ICON: Phoenix Mall',
    city: 'Mumbai',
    location: 'Lower Parel',
    distance: '2.4 km away',
    amenities: ['IMAX 3D', 'DOLBY ATMOS', 'RECLINERS', 'GOURMET FOOD'],
  },
  {
    id: 'c2',
    name: 'INOX Megaplex: Grand Central',
    city: 'Mumbai',
    location: 'Andheri West',
    distance: '4.1 km away',
    amenities: ['4DX', 'LASER PROJECTION', 'VIP LOUNGE'],
  },
  // Bengaluru Cinemas
  {
    id: 'c3',
    name: 'PVR Director\'s Cut: Orion Mall',
    city: 'Bengaluru',
    location: 'Rajajinagar',
    distance: '3.5 km away',
    amenities: ['LUXE RECLINERS', 'BUTLER ON SEAT', 'DOLBY ATMOS'],
  },
  {
    id: 'c4',
    name: 'Cinepolis Nexus Shantiniketan',
    city: 'Bengaluru',
    location: 'Whitefield',
    distance: '5.2 km away',
    amenities: ['IMAX', 'LASER 4K', 'FOOD COURT'],
  },
  // Hyderabad Cinemas
  {
    id: 'c5',
    name: 'AMB Cinemas',
    city: 'Hyderabad',
    location: 'Gachibowli',
    distance: '1.8 km away',
    amenities: ['DOLBY CINEMA', 'LASER PROJECTION', 'GOURMET DINING'],
  },
  {
    id: 'c6',
    name: 'PVR Next Galleria',
    city: 'Hyderabad',
    location: 'Panjagutta',
    distance: '4.0 km away',
    amenities: ['4DX', 'IMAX 3D', 'RECLINERS'],
  },
  // Delhi-NCR Cinemas
  {
    id: 'c7',
    name: 'PVR Director\'s Cut: Ambience',
    city: 'Delhi-NCR',
    location: 'Gurugram',
    distance: '3.1 km away',
    amenities: ['LUXE', 'GOURMET', 'DOLBY ATMOS'],
  },
  {
    id: 'c8',
    name: 'Cinepolis DLF Place',
    city: 'Delhi-NCR',
    location: 'Saket',
    distance: '6.0 km away',
    amenities: ['IMAX 3D', 'DOLBY 7.1'],
  },
  // Chennai Cinemas
  {
    id: 'c9',
    name: 'SPI Escape Cinemas',
    city: 'Chennai',
    location: 'Express Avenue, Royapettah',
    distance: '2.1 km away',
    amenities: ['DOLBY ATMOS', 'CLASSIC SNACKS', 'RECLINERS'],
  },
  {
    id: 'c10',
    name: 'PVR Luxe: Velachery',
    city: 'Chennai',
    location: 'Phoenix Marketcity',
    distance: '5.5 km away',
    amenities: ['IMAX', 'LASER PROJECTION'],
  },
  // Kolkata Cinemas
  {
    id: 'c11',
    name: 'INOX South City Mall',
    city: 'Kolkata',
    location: 'Prince Anwar Shah Road',
    distance: '3.2 km away',
    amenities: ['IMAX 3D', 'DOLBY ATMOS', 'GOURMET'],
  },
  // Pune Cinemas
  {
    id: 'c12',
    name: 'PVR Phoenix Marketcity',
    city: 'Pune',
    location: 'Viman Nagar',
    distance: '4.0 km away',
    amenities: ['4DX', 'IMAX', 'RECLINERS'],
  },
  // Ahmedabad Cinemas
  {
    id: 'c13',
    name: 'Cinepolis Acropolis Mall',
    city: 'Ahmedabad',
    location: 'Thaltej',
    distance: '2.9 km away',
    amenities: ['REALD 3D', 'DOLBY ATMOS'],
  },
];

export const SHOWTIMES: ShowTime[] = [
  // Cinema c1
  { id: 's1', cinemaId: 'c1', time: '09:30 AM', format: 'IMAX 3D', screenType: 'IMAX Screen 1', priceMultiplier: 1.3, availableSeatsCount: 84 },
  { id: 's2', cinemaId: 'c1', time: '01:15 PM', format: 'IMAX 3D', screenType: 'IMAX Screen 1', priceMultiplier: 1.5, availableSeatsCount: 32 },
  { id: 's3', cinemaId: 'c1', time: '05:00 PM', format: '4DX', screenType: 'Screen 3 (4DX)', priceMultiplier: 1.6, availableSeatsCount: 12 },
  { id: 's4', cinemaId: 'c1', time: '09:15 PM', format: 'Dolby Atmos', screenType: 'Screen 2', priceMultiplier: 1.4, availableSeatsCount: 95 },
  
  // Cinema c2
  { id: 's5', cinemaId: 'c2', time: '10:00 AM', format: '2D', screenType: 'Screen 1', priceMultiplier: 1.0, availableSeatsCount: 120 },
  { id: 's6', cinemaId: 'c2', time: '02:30 PM', format: '4DX', screenType: 'Screen 4 (4DX)', priceMultiplier: 1.5, availableSeatsCount: 45 },
  { id: 's7', cinemaId: 'c2', time: '06:45 PM', format: 'IMAX 3D', screenType: 'IMAX Screen', priceMultiplier: 1.5, availableSeatsCount: 18 },
  { id: 's8', cinemaId: 'c2', time: '10:00 PM', format: 'Dolby Atmos', screenType: 'Screen 2', priceMultiplier: 1.2, availableSeatsCount: 68 },

  // Cinema c3 (Bengaluru)
  { id: 's9', cinemaId: 'c3', time: '11:00 AM', format: 'IMAX 3D', screenType: 'IMAX Gold', priceMultiplier: 1.6, availableSeatsCount: 52 },
  { id: 's10', cinemaId: 'c3', time: '03:45 PM', format: 'Dolby Atmos', screenType: 'Screen 1', priceMultiplier: 1.3, availableSeatsCount: 88 },
  { id: 's11', cinemaId: 'c3', time: '08:00 PM', format: 'IMAX 3D', screenType: 'IMAX Gold', priceMultiplier: 1.8, availableSeatsCount: 8 },

  // Cinema c4 (Bengaluru)
  { id: 's12', cinemaId: 'c4', time: '10:30 AM', format: '2D', screenType: 'Screen 1', priceMultiplier: 1.0, availableSeatsCount: 110 },
  { id: 's13', cinemaId: 'c4', time: '02:15 PM', format: 'Dolby Atmos', screenType: 'Screen 2', priceMultiplier: 1.3, availableSeatsCount: 60 },
  { id: 's14', cinemaId: 'c4', time: '07:30 PM', format: 'Dolby Atmos', screenType: 'Screen 2', priceMultiplier: 1.5, availableSeatsCount: 24 },

  // Cinema c5 (Hyderabad)
  { id: 's15', cinemaId: 'c5', time: '10:00 AM', format: 'Dolby Cinema', screenType: 'AMB Screen 1', priceMultiplier: 1.4, availableSeatsCount: 100 },
  { id: 's16', cinemaId: 'c5', time: '01:30 PM', format: 'IMAX 3D', screenType: 'AMB Screen 2', priceMultiplier: 1.6, availableSeatsCount: 40 },
  { id: 's17', cinemaId: 'c5', time: '06:00 PM', format: 'Dolby Cinema', screenType: 'AMB Screen 1', priceMultiplier: 1.7, availableSeatsCount: 15 },

  // Cinema c6 (Hyderabad)
  { id: 's18', cinemaId: 'c6', time: '11:15 AM', format: '4DX', screenType: 'Screen 3', priceMultiplier: 1.5, availableSeatsCount: 55 },
  { id: 's19', cinemaId: 'c6', time: '03:00 PM', format: 'IMAX 3D', screenType: 'IMAX Screen', priceMultiplier: 1.6, availableSeatsCount: 30 },

  // Cinema c7 (Delhi-NCR)
  { id: 's20', cinemaId: 'c7', time: '10:00 AM', format: 'LUXE', screenType: 'Screen 1', priceMultiplier: 1.5, availableSeatsCount: 70 },
  { id: 's21', cinemaId: 'c7', time: '02:00 PM', format: 'Dolby Atmos', screenType: 'Screen 2', priceMultiplier: 1.4, availableSeatsCount: 45 },

  // Cinema c8 (Delhi-NCR)
  { id: 's22', cinemaId: 'c8', time: '12:00 PM', format: 'IMAX 3D', screenType: 'IMAX Screen', priceMultiplier: 1.6, availableSeatsCount: 50 },

  // Cinema c9 (Chennai)
  { id: 's23', cinemaId: 'c9', time: '10:30 AM', format: 'Dolby Atmos', screenType: 'Escape 1', priceMultiplier: 1.2, availableSeatsCount: 90 },
  { id: 's24', cinemaId: 'c9', time: '02:45 PM', format: '2D', screenType: 'Escape 2', priceMultiplier: 1.0, availableSeatsCount: 120 },

  // Cinema c10 (Chennai)
  { id: 's25', cinemaId: 'c10', time: '01:00 PM', format: 'IMAX 3D', screenType: 'IMAX Screen', priceMultiplier: 1.5, availableSeatsCount: 35 },

  // Cinema c11 (Kolkata)
  { id: 's26', cinemaId: 'c11', time: '11:00 AM', format: 'IMAX 3D', screenType: 'IMAX Screen', priceMultiplier: 1.4, availableSeatsCount: 65 },

  // Cinema c12 (Pune)
  { id: 's27', cinemaId: 'c12', time: '12:30 PM', format: '4DX', screenType: 'Screen 1', priceMultiplier: 1.5, availableSeatsCount: 42 },

  // Cinema c13 (Ahmedabad)
  { id: 's28', cinemaId: 'c13', time: '04:00 PM', format: 'RealD 3D', screenType: 'Screen 1', priceMultiplier: 1.2, availableSeatsCount: 80 },
];

export const SNACKS: SnackItem[] = [
  {
    id: 'sn1',
    name: 'Large Salted Popcorn + Pepsi Combo',
    description: 'Freshly popped jumbo buttery popcorn with 750ml chilled Pepsi.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop&q=80',
    category: 'combo',
  },
  {
    id: 'sn2',
    name: 'Caramel Popcorn Tub',
    description: 'Crunchy golden caramel glazed gourmet popcorn.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1588562846903-d6981881cb14?w=300&auto=format&fit=crop&q=80',
    category: 'popcorn',
  },
  {
    id: 'sn3',
    name: 'Loaded Cheese Nachos',
    description: 'Crispy corn tortilla chips drenched in warm melted cheddar and jalapeños.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1582169505501-5429b3f3f652?w=300&auto=format&fit=crop&q=80',
    category: 'combo',
  },
  {
    id: 'sn4',
    name: 'Peri Peri French Fries',
    description: 'Crispy golden fries tossed in fiery spicy peri peri seasoning.',
    price: 240,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=80',
    category: 'combo',
  },
  {
    id: 'sn5',
    name: 'Cold Coffee / Iced Frappe',
    description: 'Rich blended iced coffee with chocolate drizzle.',
    price: 220,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=80',
    category: 'beverage',
  },
  {
    id: 'sn6',
    name: 'Belgian Chocolate Lava Cake',
    description: 'Warm gooey chocolate cake with molten center and vanilla scoop.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80',
    category: 'dessert',
  },
];
