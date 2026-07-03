const axios = require('axios');
const logger = require('../utils/logger');

const MAPS_BASE = 'https://maps.googleapis.com/maps/api';

const getTravelTime = async (origins, destinations, mode = 'driving') => {
  try {
    const response = await axios.get(`${MAPS_BASE}/distancematrix/json`, {
      params: {
        origins: origins.join('|'),
        destinations: destinations.join('|'),
        mode,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    logger.error(`Google Maps direction error: ${error.message}`);
    throw new Error('Failed to get travel time');
  }
};

const getNearbyPlaces = async ({ lat, lng, radius = 2000, type = 'tourist_attraction' }) => {
  try {
    const response = await axios.get(`${MAPS_BASE}/place/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius,
        type,
        key: process.env.GOOGLE_PLACES_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    logger.error(`Google Places nearby error: ${error.message}`);
    throw new Error('Failed to get nearby places');
  }
};

const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(`${MAPS_BASE}/place/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,rating,formatted_address,photos,opening_hours,geometry,price_level',
        key: process.env.GOOGLE_PLACES_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    logger.error(`Google Place details error: ${error.message}`);
    throw new Error('Failed to get place details');
  }
};

const searchPlaces = async (query, cityName) => {
  try {
    const response = await axios.get(`${MAPS_BASE}/place/textsearch/json`, {
      params: {
        query: `${query} in ${cityName}`,
        key: process.env.GOOGLE_PLACES_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    logger.error(`Google Places search error: ${error.message}`);
    throw new Error('Failed to search places');
  }
};

module.exports = { getTravelTime, getNearbyPlaces, getPlaceDetails, searchPlaces };
