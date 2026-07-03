const axios = require('axios');
const logger = require('../utils/logger');

const IRCTC_BASE = process.env.IRCTC_BASE_URL || 'https://irctc1.p.rapidapi.com';

const irctcHeaders = {
  'X-RapidAPI-Key': process.env.IRCTC_API_KEY,
  'X-RapidAPI-Host': 'irctc1.p.rapidapi.com',
};

const searchTrains = async ({ from, to, date, classType }) => {
  try {
    const response = await axios.get(`${IRCTC_BASE}/api/v3/trainBetweenStations`, {
      headers: irctcHeaders,
      params: { fromStationCode: from, toStationCode: to, dateOfJourney: date },
    });
    return response.data;
  } catch (error) {
    logger.error(`IRCTC search error: ${error.message}`);
    throw new Error('Failed to search trains');
  }
};

const getTrainAvailability = async ({ trainNo, from, to, date, classType, quota }) => {
  try {
    const response = await axios.get(`${IRCTC_BASE}/api/v1/checkSeatAvailability`, {
      headers: irctcHeaders,
      params: {
        classType,
        fromStationCode: from,
        quota: quota || 'GN',
        toStationCode: to,
        trainNo,
        date,
      },
    });
    return response.data;
  } catch (error) {
    logger.error(`IRCTC availability error: ${error.message}`);
    throw new Error('Failed to check train availability');
  }
};

const getTrainSchedule = async (trainNo) => {
  try {
    const response = await axios.get(`${IRCTC_BASE}/api/v1/getTrainSchedule`, {
      headers: irctcHeaders,
      params: { trainNo },
    });
    return response.data;
  } catch (error) {
    logger.error(`IRCTC schedule error: ${error.message}`);
    throw new Error('Failed to get train schedule');
  }
};

module.exports = { searchTrains, getTrainAvailability, getTrainSchedule };
