const axios = require('axios');
const logger = require('../utils/logger');

let amadeusToken = null;
let tokenExpiry = null;

const getAmadeusToken = async () => {
  if (amadeusToken && tokenExpiry && Date.now() < tokenExpiry) {
    return amadeusToken;
  }

  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      `grant_type=client_credentials&client_id=${process.env.AMADEUS_CLIENT_ID}&client_secret=${process.env.AMADEUS_CLIENT_SECRET}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    amadeusToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
    return amadeusToken;
  } catch (error) {
    logger.error(`Amadeus token error: ${error.message}`);
    throw new Error('Failed to authenticate with Amadeus API');
  }
};

const searchHotels = async ({ cityCode, checkIn, checkOut, adults, rooms }) => {
  try {
    const token = await getAmadeusToken();
    const response = await axios.get(
      'https://test.api.amadeus.com/v3/shopping/hotel-offers',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          cityCode,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          adults,
          roomQuantity: rooms,
          currency: 'INR',
          bestRateOnly: false,
        },
      }
    );
    return response.data;
  } catch (error) {
    logger.error(`Amadeus hotel search error: ${error.message}`);
    throw new Error('Failed to search hotels');
  }
};

const getHotelOffer = async (offerId) => {
  try {
    const token = await getAmadeusToken();
    const response = await axios.get(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers/${offerId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    logger.error(`Amadeus hotel offer error: ${error.message}`);
    throw new Error('Failed to get hotel offer');
  }
};

module.exports = { searchHotels, getHotelOffer };
