const axios = require('axios');
const logger = require('../utils/logger');

const REDBUS_BASE = process.env.REDBUS_BASE_URL || 'https://redbus.p.rapidapi.com';

const redbusHeaders = {
  'X-RapidAPI-Key': process.env.REDBUS_API_KEY,
  'X-RapidAPI-Host': 'redbus.p.rapidapi.com',
};

const searchBuses = async ({ from, to, date }) => {
  try {
    const response = await axios.get(`${REDBUS_BASE}/bus-list`, {
      headers: redbusHeaders,
      params: { fromCityName: from, toCityName: to, doj: date },
    });
    return response.data;
  } catch (error) {
    logger.error(`RedBus search error: ${error.message}`);
    throw new Error('Failed to search buses');
  }
};

const getBusSeatLayout = async (busId) => {
  try {
    const response = await axios.get(`${REDBUS_BASE}/seat-layout`, {
      headers: redbusHeaders,
      params: { id: busId },
    });
    return response.data;
  } catch (error) {
    logger.error(`RedBus seat layout error: ${error.message}`);
    throw new Error('Failed to get bus seat layout');
  }
};

module.exports = { searchBuses, getBusSeatLayout };
