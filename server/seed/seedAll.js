require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const City = require('../models/City');
const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const HiddenGem = require('../models/HiddenGem');
const FoodShop = require('../models/FoodShop');
const SiteSettings = require('../models/SiteSettings');

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), City.deleteMany({}), Place.deleteMany({}),
    Hotel.deleteMany({}), HiddenGem.deleteMany({}), FoodShop.deleteMany({}),
    SiteSettings.deleteMany({}),
  ]);

  // ─── ADMIN USER ────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@travelbuddy.com',
    password: adminPassword,
    role: 'admin',
  });

  // ─── SAMPLE USER ───────────────────────────────────────────────
  await User.create({
    name: 'John Traveller',
    email: 'user@travelbuddy.com',
    password: adminPassword,
    role: 'user',
    bio: 'Travel enthusiast exploring the world one city at a time.',
  });

  // ─── CITIES ────────────────────────────────────────────────────
  const cities = await City.insertMany([
    {
      name: 'Mumbai',
      country: 'India',
      description: 'The city of dreams, India\'s financial capital blending colonial heritage with modern energy.',
      population: '20 million',
      language: 'Hindi, Marathi, English',
      climate: 'Tropical, hot and humid',
      culture: 'Diverse, cosmopolitan mix of communities',
      bestSeason: 'Winter',
      bestSeasonDetails: 'November to February offers the best weather with cool temperatures.',
      coordinates: { lat: 19.076, lng: 72.8777 },
      mustTryFoods: [
        { name: 'Vada Pav', description: 'Mumbai\'s iconic street food - spiced potato in a bun.' },
        { name: 'Pav Bhaji', description: 'Buttery mixed vegetable curry served with soft bread rolls.' },
        { name: 'Bhel Puri', description: 'Crispy puffed rice salad with tangy tamarind chutney.' },
      ],
      publicTransport: {
        metro: { available: true, description: 'Mumbai Metro covers major routes across the city.' },
        bus: { available: true, description: 'BEST buses cover the entire city network.' },
        taxi: { available: true, description: 'Black and yellow taxis and app-based cabs available.' },
        rickshaw: { available: true, description: 'Auto-rickshaws available in suburbs.' },
      },
    },
    {
      name: 'Jaipur',
      country: 'India',
      description: 'The Pink City, Rajasthan\'s royal capital famous for its magnificent forts and palaces.',
      population: '3.1 million',
      language: 'Hindi, Rajasthani',
      climate: 'Semi-arid, hot summers and mild winters',
      culture: 'Rich Rajput heritage, vibrant arts and crafts',
      bestSeason: 'Winter',
      bestSeasonDetails: 'October to March is ideal with pleasant temperatures.',
      coordinates: { lat: 26.9124, lng: 75.7873 },
      mustTryFoods: [
        { name: 'Dal Baati Churma', description: 'Traditional Rajasthani dish of lentils, baked wheat balls, and sweet.' },
        { name: 'Ghewar', description: 'Traditional Rajasthani sweet made during festivals.' },
        { name: 'Laal Maas', description: 'Fiery red mutton curry, a Rajput delicacy.' },
      ],
      publicTransport: {
        metro: { available: false, description: 'Metro under construction.' },
        bus: { available: true, description: 'JCTSL buses operate city-wide.' },
        taxi: { available: true, description: 'App-based cabs and local taxis widely available.' },
        rickshaw: { available: true, description: 'Auto-rickshaws are the most common local transport.' },
      },
    },
    {
      name: 'Goa',
      country: 'India',
      description: 'India\'s beach paradise with stunning coastlines, Portuguese heritage, and vibrant nightlife.',
      population: '1.5 million',
      language: 'Konkani, English, Portuguese',
      climate: 'Tropical, warm year-round',
      culture: 'Blend of Indian and Portuguese cultures',
      bestSeason: 'Winter',
      bestSeasonDetails: 'November to February for perfect beach weather.',
      coordinates: { lat: 15.2993, lng: 74.124 },
      mustTryFoods: [
        { name: 'Fish Curry Rice', description: 'Goa\'s staple - tangy coconut-based fish curry with steamed rice.' },
        { name: 'Prawn Balchão', description: 'Spicy pickled prawn preparation with Portuguese influence.' },
        { name: 'Bebinca', description: 'Traditional Goan layered dessert made with coconut milk.' },
      ],
      publicTransport: {
        bus: { available: true, description: 'Kadamba buses cover North and South Goa.' },
        taxi: { available: true, description: 'Motorbike taxis (pilots) and regular taxis.' },
        rickshaw: { available: false, description: 'Not common in Goa.' },
        other: 'Renting a scooter is the most popular way to explore Goa.',
      },
    },
  ]);

  // ─── PLACES ────────────────────────────────────────────────────
  const places = await Place.insertMany([
    {
      name: 'Gateway of India',
      cityId: cities[0]._id,
      category: 'Historical',
      description: 'Iconic arch monument built during the British Raj, overlooking the Arabian Sea.',
      openingHours: { open: '00:00', close: '23:59' },
      bestTimeToVisit: 'Early morning or sunset',
      ticketPrice: { isFree: true },
      location: { address: 'Apollo Bandar, Colaba, Mumbai', coordinates: { lat: 18.9220, lng: 72.8347 } },
      distanceFromCenter: 2.1,
      rating: 4.5,
      reviewCount: 0,
    },
    {
      name: 'Marine Drive',
      cityId: cities[0]._id,
      category: 'Nature',
      description: 'A 3.6 km long boulevard along the coast, known as the Queen\'s Necklace.',
      openingHours: { open: '00:00', close: '23:59' },
      bestTimeToVisit: 'Sunset or evening',
      ticketPrice: { isFree: true },
      location: { address: 'Marine Drive, Mumbai', coordinates: { lat: 18.9438, lng: 72.8230 } },
      distanceFromCenter: 1.5,
      rating: 4.6,
      reviewCount: 0,
    },
    {
      name: 'Amber Fort',
      cityId: cities[1]._id,
      category: 'Historical',
      description: 'Magnificent hilltop fort with stunning architecture and panoramic views of Jaipur.',
      openingHours: { open: '08:00', close: '17:30', closedOn: [] },
      bestTimeToVisit: 'Morning',
      ticketPrice: { adult: 200, child: 100, currency: 'INR' },
      location: { address: 'Devisinghpura, Amer, Jaipur', coordinates: { lat: 26.9855, lng: 75.8513 } },
      distanceFromCenter: 11,
      rating: 4.7,
      reviewCount: 0,
    },
    {
      name: 'Calangute Beach',
      cityId: cities[2]._id,
      category: 'Beach',
      description: 'Goa\'s most popular beach, known as the Queen of Beaches.',
      openingHours: { open: '00:00', close: '23:59' },
      bestTimeToVisit: 'Morning or late afternoon',
      ticketPrice: { isFree: true },
      location: { address: 'Calangute, North Goa', coordinates: { lat: 15.5440, lng: 73.7553 } },
      distanceFromCenter: 16,
      rating: 4.3,
      reviewCount: 0,
    },
  ]);

  // ─── HOTELS ────────────────────────────────────────────────────
  await Hotel.insertMany([
    {
      name: 'The Taj Mahal Palace',
      cityId: cities[0]._id,
      description: 'Iconic luxury hotel overlooking the Gateway of India and Arabian Sea.',
      starRating: 5,
      priceRange: 'luxury',
      pricePerNight: 25000,
      currency: 'INR',
      amenities: { wifi: true, pool: true, parking: true, gym: true, restaurant: true, spa: true, airConditioning: true, roomService: true, bar: true, laundry: true },
      roomTypes: [
        { type: 'double', price: 25000, capacity: 2 },
        { type: 'suite', price: 50000, capacity: 2 },
      ],
      location: { address: 'Apollo Bandar, Colaba, Mumbai', coordinates: { lat: 18.9217, lng: 72.8332 } },
      distanceFromCenter: 2,
      rating: 4.8,
      isVerified: true,
      isFeatured: true,
    },
    {
      name: 'Rambagh Palace',
      cityId: cities[1]._id,
      description: 'Former royal residence turned luxury hotel, known as the Jewel of Jaipur.',
      starRating: 5,
      priceRange: 'luxury',
      pricePerNight: 30000,
      currency: 'INR',
      amenities: { wifi: true, pool: true, parking: true, gym: true, restaurant: true, spa: true, airConditioning: true, roomService: true, bar: true, laundry: true },
      roomTypes: [
        { type: 'double', price: 30000, capacity: 2 },
        { type: 'suite', price: 60000, capacity: 4 },
      ],
      location: { address: 'Bhawani Singh Rd, Jaipur', coordinates: { lat: 26.8856, lng: 75.8082 } },
      distanceFromCenter: 5,
      rating: 4.9,
      isVerified: true,
      isFeatured: true,
    },
    {
      name: 'The Leela Goa',
      cityId: cities[2]._id,
      description: 'Beachfront luxury resort with stunning views of the Arabian Sea.',
      starRating: 5,
      priceRange: 'luxury',
      pricePerNight: 18000,
      currency: 'INR',
      amenities: { wifi: true, pool: true, parking: true, gym: true, restaurant: true, spa: true, airConditioning: true, roomService: true, bar: true, laundry: true },
      roomTypes: [
        { type: 'double', price: 18000, capacity: 2 },
        { type: 'suite', price: 40000, capacity: 4 },
      ],
      location: { address: 'Mobor, Cavelossim, South Goa', coordinates: { lat: 15.1667, lng: 73.9500 } },
      distanceFromCenter: 45,
      rating: 4.7,
      isVerified: true,
      isFeatured: true,
    },
  ]);

  // ─── HIDDEN GEMS ───────────────────────────────────────────────
  await HiddenGem.insertMany([
    {
      name: 'Chor Bazaar',
      cityId: cities[0]._id,
      description: 'Mumbai\'s legendary flea market with antiques, vintage items, and Bollywood memorabilia.',
      story: 'Known as the "Thieves Market", this 150-year-old bazaar is a treasure trove of the unusual.',
      location: { address: 'Mutton Street, Chor Bazaar, Mumbai', coordinates: { lat: 18.9568, lng: 72.8371 } },
      travelTime: { walking: '45 min from Gateway', driving: '15 min' },
      famousFoods: [
        { name: 'Tawa Pulao', description: 'Spicy street-style rice cooked on a large tawa', rating: 4.5, reviewCount: 0 },
      ],
      hasExpertBadge: true,
      expertName: 'Raju Mumbai Local Guide',
    },
    {
      name: 'Panna Meena Ka Kund',
      cityId: cities[1]._id,
      description: 'A stunning hidden stepwell near Amber Fort, rarely visited by tourists.',
      story: 'Built in the 16th century, this geometric stepwell was used for water harvesting and community gatherings.',
      location: { address: 'Near Amber Fort, Jaipur', coordinates: { lat: 26.9867, lng: 75.8495 } },
      travelTime: { walking: '10 min from Amber Fort', driving: '5 min' },
      famousFoods: [
        { name: 'Pyaaz Kachori', description: 'Crispy fried bread stuffed with spiced onion filling', rating: 4.7, reviewCount: 0 },
      ],
      hasExpertBadge: true,
      expertName: 'Kavita Jaipur Heritage Tours',
    },
  ]);

  // ─── FOOD SHOPS ────────────────────────────────────────────────
  await FoodShop.insertMany([
    {
      name: 'Aaram Nagar Vada Pav',
      cityId: cities[0]._id,
      description: 'Mumbai\'s most legendary vada pav stall, serving since 1966.',
      famousDishes: [{ name: 'Vada Pav', description: 'Original spiced potato fritter in a bun', price: 20, rating: 4.8, reviewCount: 0 }],
      location: { address: 'Dadar Station, Mumbai', coordinates: { lat: 19.0185, lng: 72.8426 } },
      openingHours: { open: '07:00', close: '21:00' },
      priceRange: 'budget',
      isHiddenGem: true,
    },
    {
      name: 'LMB (Laxmi Misthan Bhandar)',
      cityId: cities[1]._id,
      description: 'Jaipur\'s most famous sweet shop and restaurant since 1954.',
      famousDishes: [
        { name: 'Ghewar', description: 'Traditional Rajasthani sweet', price: 150, rating: 4.7, reviewCount: 0 },
        { name: 'Dal Baati Churma', description: 'Complete Rajasthani thali', price: 350, rating: 4.8, reviewCount: 0 },
      ],
      location: { address: 'Johari Bazaar, Jaipur', coordinates: { lat: 26.9229, lng: 75.8251 } },
      openingHours: { open: '08:00', close: '22:00' },
      priceRange: 'mid-range',
      isHiddenGem: false,
    },
  ]);

  // ─── SITE SETTINGS ─────────────────────────────────────────────
  await SiteSettings.create({
    siteName: 'Travel Buddy',
    contactEmail: 'support@travelbuddy.com',
    aboutUs: 'Travel Buddy is your all-in-one travel planning companion. Plan trips, book hotels, trains, and buses, and discover hidden gems across India.',
    termsOfService: 'These terms govern your use of Travel Buddy platform...',
    privacyPolicy: 'We value your privacy and are committed to protecting your data...',
    faq: [
      { question: 'How do I create a trip plan?', answer: 'Click on "Plan a Trip" and select your destination, dates, and number of travelers. You can either use our AI generator or build your itinerary manually.', order: 1 },
      { question: 'Can I cancel my hotel booking?', answer: 'Yes, you can cancel bookings from your dashboard under "My Bookings". Refund eligibility depends on the cancellation policy.', order: 2 },
      { question: 'How does the Hidden Gems feature work?', answer: 'Hidden Gems are curated lesser-known spots in each city, added by our local experts. Visit the city page and click "Hidden Gems" to explore.', order: 3 },
    ],
    refundPolicies: {
      hotel: { fullRefundDays: 7, partialRefundDays: 3, partialRefundPercent: 50, noRefundDays: 1 },
      train: { fullRefundDays: 3, partialRefundDays: 1, partialRefundPercent: 50 },
      bus: { fullRefundDays: 2, partialRefundDays: 1, partialRefundPercent: 50 },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('👤 Admin: admin@travelbuddy.com / admin123');
  console.log('👤 User: user@travelbuddy.com / admin123');
  mongoose.connection.close();
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.connection.close();
  process.exit(1);
});
