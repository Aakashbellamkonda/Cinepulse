import React, { useState, useEffect } from 'react';
import { 
  Film, Search, MapPin, Calendar, Clock, Star, Sparkles, X, CheckCircle, 
  Ticket, Heart, ChevronRight, Share2, Volume2, ShieldCheck, CreditCard, 
  Smartphone, Building2, Download, Trash2, HelpCircle, User, ArrowLeft, Plus, Minus
} from 'lucide-react';
import { MOVIES, CINEMAS, SHOWTIMES, SNACKS, CITIES, POPULAR_CITIES, GENRES, LANGUAGES } from './data/mockData';
import { Movie, Cinema, ShowTime, SnackItem, Booking } from './types';

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'home' | 'movies' | 'bookings' | 'ai-concierge'>('home');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  
  // Selected Movie & Booking Flow States
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [bookingStep, setBookingStep] = useState<'showtimes' | 'seats' | 'snacks' | 'payment' | 'success' | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowTime | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('Today, 28 Sep');
  const [selectedSeats, setSelectedSeats] = useState<{ id: string; row: string; number: number; type: string; price: number }[]>([]);
  const [selectedSnacks, setSelectedSnacks] = useState<{ item: SnackItem; quantity: number }[]>([]);
  
  // Razorpay Payment Modal State
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // My Bookings list from LocalStorage
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);

  // City Modal State
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  // AI Concierge Chat State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: "Hello! I'm your CinePulse AI cinematic concierge. Tell me what mood you're in, what actors you love, or what kind of thrill you're craving, and I'll recommend the perfect show!" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load saved bookings on mount
  useEffect(() => {
    const saved = localStorage.getItem('cinepulse_bookings');
    if (saved) {
      try {
        setBookingsList(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save bookings to localStorage
  const saveBookingToStorage = (newBooking: Booking) => {
    const updated = [newBooking, ...bookingsList];
    setBookingsList(updated);
    localStorage.setItem('cinepulse_bookings', JSON.stringify(updated));
    setCurrentBooking(newBooking);
  };

  // Filter movies by location city and search/genre/language
  const filteredMovies = MOVIES.filter(movie => {
    const matchesCity = !movie.cities || movie.cities.includes(selectedCity);
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre);
    const matchesLang = selectedLanguage === 'All' || movie.language === selectedLanguage;
    return matchesCity && matchesSearch && matchesGenre && matchesLang;
  });

  // Calculate ticket pricing
  const baseSeatPrice = 280;
  const multiplier = selectedShowtime?.priceMultiplier || 1.2;
  const ticketTotal = selectedSeats.reduce((acc, s) => acc + Math.round(baseSeatPrice * multiplier * (s.type === 'recliner' ? 1.6 : s.type === 'executive' ? 1.3 : 1.0)), 0);
  const snacksTotal = selectedSnacks.reduce((acc, s) => acc + s.item.price * s.quantity, 0);
  const convenienceFee = selectedSeats.length > 0 ? 45 * selectedSeats.length : 0;
  const gst = Math.round((ticketTotal + convenienceFee) * 0.18);
  const grandTotal = ticketTotal + snacksTotal + convenienceFee + gst;

  // Handle Seat Selection toggle
  const toggleSeat = (id: string, row: string, number: number, type: string, price: number) => {
    if (selectedSeats.some(s => s.id === id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== id));
    } else {
      if (selectedSeats.length >= 10) {
        alert('You can select a maximum of 10 seats per transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, { id, row, number, type, price }]);
    }
  };

  // Snack quantity handler
  const updateSnackQty = (item: SnackItem, delta: number) => {
    const existing = selectedSnacks.find(s => s.item.id === item.id);
    if (existing) {
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        setSelectedSnacks(selectedSnacks.filter(s => s.item.id !== item.id));
      } else {
        setSelectedSnacks(selectedSnacks.map(s => s.item.id === item.id ? { ...s, quantity: newQty } : s));
      }
    } else if (delta > 0) {
      setSelectedSnacks([...selectedSnacks, { item, quantity: 1 }]);
    }
  };

  // Process Razorpay Payment
  const handleRazorpayPayment = async () => {
    setIsProcessingPayment(true);
    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal, receipt: `rcpt_${Date.now()}` }),
      });
      const orderData = await orderRes.json();

      // Simulate payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. Verify payment on server
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderData.id,
          razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 12)}`,
          razorpay_signature: 'sig_mock_verified',
        }),
      });
      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        const newBooking: Booking = {
          id: `bk_${Date.now()}`,
          bookingRef: `CP-${Math.floor(100000 + Math.random() * 900000)}`,
          movieTitle: selectedMovie?.title || 'Movie',
          moviePoster: selectedMovie?.poster || '',
          cinemaName: selectedCinema?.name || 'PVR Cinema',
          location: selectedCinema?.location || selectedCity,
          showDate: selectedDate,
          showTime: selectedShowtime?.time || '07:00 PM',
          format: selectedShowtime?.format || 'IMAX 3D',
          seats: selectedSeats.map(s => s.id),
          seatType: selectedSeats[0]?.type.toUpperCase() || 'CLUB',
          snacks: selectedSnacks,
          ticketAmount: ticketTotal,
          snacksAmount: snacksTotal,
          convenienceFee,
          gst,
          totalAmount: grandTotal,
          paymentId: verifyData.paymentId,
          bookingTime: new Date().toLocaleString(),
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CINEPULSE-TICKET-${verifyData.paymentId}`,
          status: 'confirmed',
        };

        saveBookingToStorage(newBooking);
        setIsRazorpayOpen(false);
        setBookingStep('success');
      } else {
        alert('Payment verification failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Payment processing error. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // AI Concierge Chat Handler
  const handleAiSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isAiLoading) return;
    const userMsg = aiPrompt;
    setAiPrompt('');
    setAiMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          userPreferences: { city: selectedCity, availableMovies: MOVIES.map(m => m.title) },
        }),
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { sender: 'ai', text: data.text }]);
    } catch (error) {
      setAiMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't reach the cinematic concierge right now. Try exploring our trending movies!" }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav Links) - Zone 3 (Actions) */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Zone 1: Brand */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => { setActiveTab('home'); setBookingStep(null); setSelectedMovie(null); }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">CinePulse</span>
              <span className="text-[10px] tracking-widest text-amber-400 font-semibold uppercase block">Cinemas & Live</span>
            </div>
          </button>

          {/* City Selector (BookMyShow style trigger) */}
          <button 
            onClick={() => setIsCityModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl text-xs text-slate-200 font-medium transition-colors group"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>{selectedCity}</span>
            <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">Change</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button 
            onClick={() => { setActiveTab('home'); setBookingStep(null); setSelectedMovie(null); }}
            className={`transition-colors hover:text-white ${activeTab === 'home' && !selectedMovie && !bookingStep ? 'text-amber-400 font-semibold' : ''}`}
          >
            Movies
          </button>
          <button 
            onClick={() => { setActiveTab('movies'); setBookingStep(null); setSelectedMovie(null); }}
            className={`transition-colors hover:text-white ${activeTab === 'movies' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Explore
          </button>
          <button 
            onClick={() => { setActiveTab('bookings'); setBookingStep(null); setSelectedMovie(null); }}
            className={`transition-colors hover:text-white ${activeTab === 'bookings' ? 'text-amber-400 font-semibold' : ''}`}
          >
            My Bookings ({bookingsList.length})
          </button>
          <button 
            onClick={() => { setActiveTab('ai-concierge'); setBookingStep(null); setSelectedMovie(null); }}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${activeTab === 'ai-concierge' ? 'text-amber-400 font-semibold' : ''}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            AI Concierge
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block w-56">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search movies, genres..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <button 
            onClick={() => setActiveTab('bookings')}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-md shadow-amber-400/20"
          >
            Tickets ({bookingsList.length})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        
        {/* VIEW 1: BOOKING SUCCESS / E-TICKET (WITH CLOSE WINDOW REQUIREMENT) */}
        {bookingStep === 'success' && currentBooking && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Booking Confirmed!</h2>
              <p className="text-xs text-slate-400 mt-1">Your seats are locked and Razorpay payment was successful.</p>
            </div>

            {/* E-Ticket Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative">
              <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-slate-800 pb-6">
                <img 
                  src={currentBooking.moviePoster} 
                  alt={currentBooking.movieTitle} 
                  className="w-24 h-36 object-cover rounded-lg shadow-md border border-slate-800 shrink-0" 
                />
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs text-amber-400 font-medium uppercase tracking-wider block mb-1">
                    Booking ID: {currentBooking.bookingRef}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{currentBooking.movieTitle}</h3>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {currentBooking.cinemaName}, {currentBooking.location}
                    </p>
                    <p className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {currentBooking.showDate} at <strong className="text-white">{currentBooking.showTime}</strong>
                    </p>
                    <p className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-slate-400" />
                      Format: <span className="text-amber-300">{currentBooking.format}</span> | Seats: <strong className="text-white">{currentBooking.seats.join(', ')}</strong> ({currentBooking.seatType})
                    </p>
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl shadow-md shrink-0">
                  <img src={currentBooking.qrCodeUrl} alt="Ticket QR Code" className="w-24 h-24 object-contain" />
                </div>
              </div>

              {/* Snacks summary if any */}
              {currentBooking.snacks.length > 0 && (
                <div className="py-4 border-b border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold block mb-1">Add-on F&B Snacks:</span>
                  <div className="flex flex-wrap gap-2">
                    {currentBooking.snacks.map((sn, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300">
                        {sn.item.name} × {sn.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">Paid via Razorpay ({currentBooking.paymentId})</span>
                <span className="text-lg font-bold text-emerald-400">₹{currentBooking.totalAmount}</span>
              </div>
            </div>

            {/* Actions: Download, Share & Close Window */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download / Print
                </button>

                <button 
                  onClick={async () => {
                    if (!currentBooking) return;
                    const shareText = `🎬 I just booked tickets for "${currentBooking.movieTitle}" at ${currentBooking.cinemaName} (${currentBooking.location})! Showtime: ${currentBooking.showDate} at ${currentBooking.showTime}. Seats: ${currentBooking.seats.join(', ')}. Booking Ref: ${currentBooking.bookingRef}. Booked via CinePulse!`;
                    if (navigator.share) {
                      try {
                        await navigator.share({ title: `Movie Booking: ${currentBooking.movieTitle}`, text: shareText, url: window.location.href });
                        return;
                      } catch (err) {}
                    }
                    try {
                      await navigator.clipboard.writeText(shareText);
                      alert('Booking shareable text copied to clipboard! Share it with friends on WhatsApp, Twitter, or Instagram.');
                    } catch (e) {
                      alert(shareText);
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-amber-500/30"
                >
                  <Share2 className="w-4 h-4" />
                  Share Booking
                </button>
              </div>

              {/* Explicit User Requirement: "ican close the window after successfully booking" */}
              <button 
                onClick={() => {
                  setBookingStep(null);
                  setSelectedMovie(null);
                  setActiveTab('home');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
              >
                <X className="w-4 h-4" />
                Close Window & Return Home
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: SEAT SELECTION & SHOWTIME FLOW */}
        {selectedMovie && bookingStep && bookingStep !== 'success' && (
          <div>
            {/* Top Bar for Booking Flow */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    if (bookingStep === 'showtimes') { setSelectedMovie(null); setBookingStep(null); }
                    else if (bookingStep === 'seats') setBookingStep('showtimes');
                    else if (bookingStep === 'snacks') setBookingStep('seats');
                    else if (bookingStep === 'payment') setBookingStep('snacks');
                  }}
                  className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedMovie.title}</h2>
                  <p className="text-xs text-slate-400">{selectedMovie.language} · {selectedMovie.censorRating} · {selectedMovie.duration}</p>
                </div>
              </div>

              {/* Step indicator */}
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className={bookingStep === 'showtimes' ? 'text-amber-400 font-bold' : ''}>1. Showtime</span> / 
                <span className={bookingStep === 'seats' ? 'text-amber-400 font-bold' : ''}>2. Seats</span> / 
                <span className={bookingStep === 'snacks' ? 'text-amber-400 font-bold' : ''}>3. Snacks</span> / 
                <span className={bookingStep === 'payment' ? 'text-amber-400 font-bold' : ''}>4. Payment</span>
              </div>
            </div>

            {/* STEP A: SHOWTIME & CINEMA PICKER */}
            {bookingStep === 'showtimes' && (
              <div className="space-y-6">
                {/* Date selection bar */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {['Today, 28 Sep', 'Mon, 29 Sep', 'Tue, 30 Sep', 'Wed, 01 Oct', 'Thu, 02 Oct'].map((date, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedDate === date ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'}`}
                    >
                      {date}
                    </button>
                  ))}
                </div>

                {/* Cinemas list filtered by city */}
                <div className="space-y-4">
                  {CINEMAS.filter(c => c.city === selectedCity).length === 0 ? (
                    <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                      No cinemas listed for {selectedCity} yet. Try selecting Mumbai or Bengaluru!
                    </div>
                  ) : (
                    CINEMAS.filter(c => c.city === selectedCity).map(cinema => (
                      <div key={cinema.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-white">{cinema.name}</h3>
                              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-medium">M-Ticket</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{cinema.location} · <span className="text-emerald-400">{cinema.distance}</span></p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {cinema.amenities.map((am, i) => (
                              <span key={i} className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-1 rounded text-slate-400">{am}</span>
                            ))}
                          </div>
                        </div>

                        {/* Showtimes for this cinema */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                          {SHOWTIMES.filter(s => s.cinemaId === cinema.id).map(st => (
                            <button
                              key={st.id}
                              onClick={() => {
                                setSelectedCinema(cinema);
                                setSelectedShowtime(st);
                                setBookingStep('seats');
                              }}
                              className="group p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 hover:bg-amber-500/5 text-left transition-all"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{st.time}</span>
                                <span className="text-[10px] text-emerald-400 font-medium">{st.availableSeatsCount} seats</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block">{st.format} · {st.screenType}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* STEP B: INTERACTIVE SEAT SELECTION */}
            {bookingStep === 'seats' && selectedCinema && selectedShowtime && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full shadow-lg shadow-amber-500/50 mb-2" />
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">All eyes this way please · SCREEN THIS SIDE</span>
                  </div>

                  {/* Seat Matrix */}
                  <div className="space-y-6 overflow-x-auto py-4">
                    {/* Recliner Tier */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 border-b border-slate-800 pb-1">
                        <span>RECLINER — ₹450</span>
                        <span>Luxurious Comfort</span>
                      </div>
                      <div className="grid grid-cols-10 gap-2 justify-center">
                        {['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'].map((id, idx) => {
                          const isBooked = id === 'A3' || id === 'A7';
                          const isSelected = selectedSeats.some(s => s.id === id);
                          return (
                            <button
                              key={id}
                              disabled={isBooked}
                              onClick={() => toggleSeat(id, 'A', idx + 1, 'recliner', 450)}
                              className={`py-2 rounded-lg text-xs font-bold transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                                isBooked ? 'bg-slate-800 text-slate-600 cursor-not-allowed' :
                                isSelected ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 scale-110 -translate-y-0.5' :
                                'bg-slate-950 border border-slate-700 text-slate-300 hover:border-amber-400 hover:scale-110 hover:-translate-y-0.5'
                              }`}
                            >
                              {id}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Executive Tier */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 border-b border-slate-800 pb-1">
                        <span>EXECUTIVE — ₹350</span>
                        <span>Best View</span>
                      </div>
                      <div className="grid grid-cols-10 gap-2">
                        {['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'].map((id, idx) => {
                          const isBooked = id === 'B2' || id === 'B5' || id === 'B9';
                          const isSelected = selectedSeats.some(s => s.id === id);
                          return (
                            <button
                              key={id}
                              disabled={isBooked}
                              onClick={() => toggleSeat(id, 'B', idx + 1, 'executive', 350)}
                              className={`py-2 rounded-lg text-xs font-bold transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                                isBooked ? 'bg-slate-800 text-slate-600 cursor-not-allowed' :
                                isSelected ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 scale-110 -translate-y-0.5' :
                                'bg-slate-950 border border-slate-700 text-slate-300 hover:border-amber-400 hover:scale-110 hover:-translate-y-0.5'
                              }`}
                            >
                              {id}
                            </button>
                          );
                        })}
                      </div>
                      <div className="grid grid-cols-10 gap-2 mt-2">
                        {['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'].map((id, idx) => {
                          const isBooked = id === 'C4' || id === 'C8';
                          const isSelected = selectedSeats.some(s => s.id === id);
                          return (
                            <button
                              key={id}
                              disabled={isBooked}
                              onClick={() => toggleSeat(id, 'C', idx + 1, 'executive', 350)}
                              className={`py-2 rounded-lg text-xs font-bold transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                                isBooked ? 'bg-slate-800 text-slate-600 cursor-not-allowed' :
                                isSelected ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 scale-110 -translate-y-0.5' :
                                'bg-slate-950 border border-slate-700 text-slate-300 hover:border-amber-400 hover:scale-110 hover:-translate-y-0.5'
                              }`}
                            >
                              {id}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stalls Tier */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 border-b border-slate-800 pb-1">
                        <span>STALLS — ₹220</span>
                        <span>Economy</span>
                      </div>
                      <div className="grid grid-cols-10 gap-2">
                        {['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'].map((id, idx) => {
                          const isBooked = false;
                          const isSelected = selectedSeats.some(s => s.id === id);
                          return (
                            <button
                              key={id}
                              disabled={isBooked}
                              onClick={() => toggleSeat(id, 'D', idx + 1, 'stalls', 220)}
                              className={`py-2 rounded-lg text-xs font-bold transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                                isBooked ? 'bg-slate-800 text-slate-600 cursor-not-allowed' :
                                isSelected ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 scale-110 -translate-y-0.5' :
                                'bg-slate-950 border border-slate-700 text-slate-300 hover:border-amber-400 hover:scale-110 hover:-translate-y-0.5'
                              }`}
                            >
                              {id}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Seat Legend */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-slate-950 border border-slate-700 rounded" /> Available</div>
                    <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-amber-400 rounded" /> Selected</div>
                    <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-slate-800 rounded" /> Booked</div>
                  </div>
                </div>

                {/* Summary Sidebar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-fit">
                  <div>
                    <h3 className="text-base font-bold text-white mb-4">Booking Summary</h3>
                    <div className="space-y-3 text-xs text-slate-300 border-b border-slate-800 pb-4">
                      <p><strong className="text-white">Cinema:</strong> {selectedCinema.name}</p>
                      <p><strong className="text-white">Showtime:</strong> {selectedShowtime.time} ({selectedShowtime.format})</p>
                      <p><strong className="text-white">Selected Seats ({selectedSeats.length}):</strong> {selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : 'None selected'}</p>
                    </div>

                    <div className="py-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tickets Subtotal</span>
                        <span className="text-white font-medium">₹{ticketTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Convenience Fee</span>
                        <span className="text-white font-medium">₹{convenienceFee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-semibold text-white">Total Amount</span>
                      <span className="text-xl font-bold text-amber-400">₹{ticketTotal + convenienceFee}</span>
                    </div>
                    <button
                      disabled={selectedSeats.length === 0}
                      onClick={() => setBookingStep('snacks')}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${
                        selectedSeats.length === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                      }`}
                    >
                      Proceed to Snacks & Beverages
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP C: SNACKS & BEVERAGES ADD-ONS */}
            {bookingStep === 'snacks' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">Grab a Bite? Delicious Cinema Munchies</h3>
                    <button 
                      onClick={() => setBookingStep('payment')}
                      className="text-xs text-amber-400 hover:underline font-medium"
                    >
                      Skip Snacks & Proceed →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SNACKS.map(snack => {
                      const existing = selectedSnacks.find(s => s.item.id === snack.id);
                      const qty = existing ? existing.quantity : 0;
                      return (
                        <div key={snack.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 items-center">
                          <img src={snack.image} alt={snack.name} className="w-20 h-20 object-cover rounded-lg border border-slate-800 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{snack.name}</h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{snack.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-bold text-amber-400">₹{snack.price}</span>
                              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1">
                                <button 
                                  onClick={() => updateSnackQty(snack, -1)}
                                  className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-white w-4 text-center">{qty}</span>
                                <button 
                                  onClick={() => updateSnackQty(snack, 1)}
                                  className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Checkout Summary Sidebar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-fit">
                  <div>
                    <h3 className="text-base font-bold text-white mb-4">Payment Summary</h3>
                    <div className="space-y-2 text-xs text-slate-300 border-b border-slate-800 pb-4">
                      <div className="flex justify-between">
                        <span>Tickets ({selectedSeats.length})</span>
                        <span>₹{ticketTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Convenience Fee</span>
                        <span>₹{convenienceFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Snacks Total</span>
                        <span>₹{snacksTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%)</span>
                        <span>₹{gst}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-semibold text-white">Grand Total</span>
                      <span className="text-xl font-bold text-amber-400">₹{grandTotal}</span>
                    </div>
                    <button
                      onClick={() => setBookingStep('payment')}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-400/20"
                    >
                      Proceed to Secure Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP D: RAZORPAY PAYMENT GATEWAY INTEGRATION */}
            {bookingStep === 'payment' && (
              <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">RZP</div>
                    <div>
                      <h3 className="text-base font-bold text-white">Razorpay Secure Gateway</h3>
                      <p className="text-[10px] text-slate-400">Encrypted & PCI-DSS compliant payment processing</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-400">₹{grandTotal}</span>
                </div>

                {/* Payment Options Tabs */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'netbanking', label: 'NetBanking', icon: Building2 },
                    { id: 'wallet', label: 'Wallets', icon: Ticket },
                  ].map(tab => {
                    const IconComp = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setPaymentMethod(tab.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                          paymentMethod === tab.id ? 'bg-amber-400/10 border-amber-400 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Payment Form based on method */}
                <div className="space-y-4 mb-6">
                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Enter UPI ID / VPA</label>
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">A payment request will be sent to your Google Pay, PhonePe, or Paytm app.</p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Card Number</label>
                        <input type="text" placeholder="4532 ···· ···· 8920" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Expiry (MM/YY)</label>
                          <input type="text" placeholder="12/28" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">CVV</label>
                          <input type="password" placeholder="•••" maxLength={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Bank</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400">
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Wallet</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Paytm Wallet', 'Mobikwik', 'Amazon Pay', 'Freecharge'].map((w, idx) => (
                          <button key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-left text-slate-200 hover:border-amber-400 transition-colors">
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  disabled={isProcessingPayment}
                  onClick={handleRazorpayPayment}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Razorpay Secure Payment...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Pay ₹{grandTotal} Securely Now
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: MOVIE DETAIL MODAL / VIEW */}
        {selectedMovie && !bookingStep && (
          <div className="space-y-8">
            {/* Backdrop Hero Header */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
              <div className="absolute inset-0">
                <img src={selectedMovie.backdrop} alt={selectedMovie.title} className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              </div>

              <div className="relative p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start">
                <img src={selectedMovie.poster} alt={selectedMovie.title} className="w-48 h-72 object-cover rounded-xl shadow-2xl border border-slate-700 shrink-0 mx-auto md:mx-0" />
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-md font-semibold">
                      {selectedMovie.censorRating}
                    </span>
                    <span className="text-xs text-slate-300">{selectedMovie.language}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-300">{selectedMovie.duration}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{selectedMovie.title}</h1>

                  {/* Genres unboxed with typographic separators */}
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400 font-medium">
                    {selectedMovie.genre.map((g, i) => (
                      <span key={i} className="flex items-center gap-2">
                        {g}
                        {i < selectedMovie.genre.length - 1 && <span aria-hidden="true">·</span>}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-amber-400 font-semibold bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl w-fit mx-auto md:mx-0">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{selectedMovie.rating}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">{selectedMovie.synopsis}</p>

                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      onClick={() => setBookingStep('showtimes')}
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2"
                    >
                      <Ticket className="w-4 h-4" />
                      Book Tickets Now
                    </button>
                    <button
                      onClick={() => setSelectedMovie(null)}
                      className="px-5 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Back to Movies
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cast & Crew */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Top Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {selectedMovie.cast.map((c, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                    <img src={c.image} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-[10px] text-slate-400">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: MY BOOKINGS LIST */}
        {activeTab === 'bookings' && !selectedMovie && !bookingStep && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">My Bookings</h2>
                <p className="text-xs text-slate-400">All your active e-tickets and past movie outings.</p>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-medium">
                {bookingsList.length} Tickets Booked
              </span>
            </div>

            {bookingsList.length === 0 ? (
              <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
                <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Bookings Yet</h3>
                <p className="text-xs text-slate-400 mb-4">Explore our blockbuster collection and book your first show!</p>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="px-5 py-2.5 bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookingsList.map(bk => (
                  <div key={bk.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <img src={bk.moviePoster} alt={bk.movieTitle} className="w-20 h-28 object-cover rounded-lg border border-slate-800 shrink-0" />
                      <div>
                        <span className="text-[10px] text-amber-400 font-semibold uppercase">{bk.bookingRef}</span>
                        <h3 className="text-base font-bold text-white mt-0.5">{bk.movieTitle}</h3>
                        <p className="text-xs text-slate-300 mt-1">{bk.cinemaName}, {bk.location}</p>
                        <p className="text-xs text-slate-400">{bk.showDate} at {bk.showTime} · <span className="text-white font-medium">{bk.seats.join(', ')}</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => {
                          setCurrentBooking(bk);
                          setBookingStep('success');
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                      >
                        View Ticket QR
                      </button>
                      <button 
                        onClick={() => {
                          const updated = bookingsList.filter(b => b.id !== bk.id);
                          setBookingsList(updated);
                          localStorage.setItem('cinepulse_bookings', JSON.stringify(updated));
                        }}
                        className="w-full sm:w-auto p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-colors"
                        title="Cancel Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: AI CONCIERGE CHAT */}
        {activeTab === 'ai-concierge' && !selectedMovie && !bookingStep && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[650px]">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">CinePulse AI Concierge</h2>
                <p className="text-[10px] text-slate-400">Powered by Gemini 3.8 Flash · Ask for tailored movie recommendations</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' ? 'bg-amber-400 text-slate-950 font-medium rounded-br-none' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    Concierge is brainstorming recommendations...
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <form onSubmit={handleAiSend} className="mt-4 pt-4 border-t border-slate-800 flex gap-3">
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Recommend a high-octane sci-fi thriller for tonight..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button 
                type="submit" 
                disabled={isAiLoading || !aiPrompt.trim()}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 text-slate-950 text-xs font-bold rounded-xl transition-all"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* VIEW 6: HOME MOVIE CATALOGUE */}
        {activeTab === 'home' && !selectedMovie && !bookingStep && (
          <div className="space-y-8">
            {/* Hero Carousel Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between">
              <div className="absolute inset-0 opacity-20">
                <img src={MOVIES[0].backdrop} alt="Banner" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 max-w-xl space-y-4 text-center md:text-left mb-6 md:mb-0">
                <span className="text-[10px] tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full font-bold uppercase">
                  Now Showing in IMAX & 4DX
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {MOVIES[0].title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                  {MOVIES[0].synopsis}
                </p>
                <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
                  <button
                    onClick={() => setSelectedMovie(MOVIES[0])}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2"
                  >
                    <Ticket className="w-4 h-4" />
                    Book Tickets Now
                  </button>
                </div>
              </div>
              <div className="relative z-10 shrink-0">
                <img 
                  src={MOVIES[0].poster} 
                  alt={MOVIES[0].title} 
                  className="w-48 h-72 object-cover rounded-xl shadow-2xl border border-slate-700 hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => setSelectedMovie(MOVIES[0])}
                />
              </div>
            </div>

            {/* Filter Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white tracking-tight">Recommended Movies</h2>
                
                {/* Genre Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
                  {GENRES.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        selectedGenre === genre ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMovies.map((movie, idx) => (
                <div 
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  style={{ animationDelay: `${idx * 80}ms` }}
                  className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 shadow-lg animate-fade-slide opacity-0"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {movie.rating.split(' ')[0]}
                    </div>
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {movie.formats.slice(0, 2).map((fmt, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-950/90 text-slate-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">{movie.title}</h3>
                    
                    {/* Unboxed Metadata with separators */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{movie.language}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{movie.genre.slice(0, 2).join(', ')}</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500">{movie.duration}</span>
                      <span className="text-xs font-bold text-amber-400 group-hover:underline flex items-center gap-1">
                        Book Tickets <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <p>© 2026 CinePulse Cinemas & Entertainment Ltd. Powered by Razorpay secure payments & Gemini AI.</p>
      </footer>

      {/* BookMyShow Style City Selection Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Select Your City</h3>
              </div>
              <button 
                onClick={() => setIsCityModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search City Input */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search for your city..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Popular Cities</div>

            {/* Popular Cities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-y-auto pr-2">
              {POPULAR_CITIES.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase())).map((cityObj) => (
                <button
                  key={cityObj.name}
                  onClick={() => {
                    setSelectedCity(cityObj.name);
                    setIsCityModalOpen(false);
                  }}
                  className={`group relative rounded-2xl overflow-hidden border p-3 flex flex-col items-center gap-2 transition-all ${
                    selectedCity === cityObj.name ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/20' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <img src={cityObj.image} alt={cityObj.name} className="w-16 h-16 rounded-full object-cover border border-slate-700 group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-bold text-white mt-1">{cityObj.name}</span>
                  <span className="text-[10px] text-emerald-400">{cityObj.cinemasCount} cinemas</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
