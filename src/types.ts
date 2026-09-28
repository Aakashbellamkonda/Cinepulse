export interface Movie {
  id: string;
  title: string;
  genre: string[];
  language: string;
  rating: string; // e.g. "9.4/10 (120K votes)"
  censorRating: string; // e.g. "UA", "A", "PG-13"
  duration: string; // e.g. "2h 45m"
  releaseDate: string;
  poster: string;
  backdrop: string;
  synopsis: string;
  cast: { name: string; role: string; image: string }[];
  director: string;
  formats: string[]; // e.g. ["2D", "IMAX 3D", "4DX", "Dolby Atmos"]
  trending?: boolean;
  featured?: boolean;
  cities?: string[]; // Cities where this movie is available
}

export interface Cinema {
  id: string;
  name: string;
  city: string;
  location: string;
  distance: string;
  amenities: string[]; // e.g. ["M-Ticket", "Food & Beverage", "Recliners"]
}

export interface ShowTime {
  id: string;
  cinemaId: string;
  time: string;
  format: string;
  screenType: string;
  priceMultiplier: number;
  availableSeatsCount: number;
}

export interface Seat {
  id: string; // e.g. "A1", "B4"
  row: string;
  number: number;
  type: 'stalls' | 'club' | 'executive' | 'recliner';
  price: number;
  status: 'available' | 'booked' | 'selected';
}

export interface SnackItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'popcorn' | 'beverage' | 'combo' | 'dessert';
}

export interface Booking {
  id: string;
  bookingRef: string;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
  location: string;
  showDate: string;
  showTime: string;
  format: string;
  seats: string[];
  seatType: string;
  snacks: { item: SnackItem; quantity: number }[];
  ticketAmount: number;
  snacksAmount: number;
  convenienceFee: number;
  gst: number;
  totalAmount: number;
  paymentId: string;
  bookingTime: string;
  qrCodeUrl: string;
  status: 'confirmed' | 'cancelled';
}
