const axios = require('axios');
const logger = require('../utils/logger');

const getWeatherForecast = async (city, days = 7) => {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q: city,
        cnt: days * 8, // 3-hour intervals
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    logger.error(`Weather API error: ${error.message}`);
    throw new Error('Failed to get weather forecast');
  }
};

const getCurrentWeather = async (city) => {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    logger.error(`Current weather error: ${error.message}`);
    throw new Error('Failed to get current weather');
  }
};

module.exports = { getWeatherForecast, getCurrentWeather };
