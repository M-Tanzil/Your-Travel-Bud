const axios = require('axios');
const logger = require('../utils/logger');

// Provider-agnostic AI service — swap provider in .env when decided
const generateItinerary = async ({ city, days, travelers, preferences }) => {
  const prompt = `Create a detailed ${days}-day travel itinerary for ${city}.
Travelers: ${travelers.adults} adults, ${travelers.children} children.
Preferences: ${preferences || 'general sightseeing, local food, culture'}.

Return a JSON object with this exact structure:
{
  "title": "Trip title",
  "summary": "Brief trip summary",
  "days": [
    {
      "dayNumber": 1,
      "theme": "Day theme",
      "places": [
        {
          "name": "Place name",
          "category": "Category",
          "description": "Brief description",
          "estimatedDuration": "2 hours",
          "bestTimeToVisit": "Morning",
          "travelTimeFromPrev": 15
        }
      ],
      "notes": "Day tips"
    }
  ],
  "estimatedBudget": {
    "hotel": 5000,
    "transport": 2000,
    "food": 1500,
    "activities": 1000
  }
}`;

  try {
    // Placeholder — implement based on chosen provider
    if (process.env.AI_PROVIDER === 'openai') {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a professional travel planner. Always respond with valid JSON only.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        },
        { headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` } }
      );
      return JSON.parse(response.data.choices[0].message.content);
    }

    // Fallback mock for development
    return {
      title: `${days}-Day ${city} Adventure`,
      summary: `An exciting ${days}-day trip to ${city} filled with culture, food, and exploration.`,
      days: Array.from({ length: days }, (_, i) => ({
        dayNumber: i + 1,
        theme: `Day ${i + 1} - Explore ${city}`,
        places: [
          {
            name: `Top Attraction ${i + 1}`,
            category: 'Historical',
            description: 'A must-visit landmark in the city.',
            estimatedDuration: '2 hours',
            bestTimeToVisit: 'Morning',
            travelTimeFromPrev: 20,
          },
          {
            name: `Local Food Spot ${i + 1}`,
            category: 'Food',
            description: 'Famous local restaurant.',
            estimatedDuration: '1 hour',
            bestTimeToVisit: 'Afternoon',
            travelTimeFromPrev: 15,
          },
        ],
        notes: 'Carry water and wear comfortable shoes.',
      })),
      estimatedBudget: { hotel: 5000 * days, transport: 2000, food: 1500 * days, activities: 500 * days },
    };
  } catch (error) {
    logger.error(`AI itinerary error: ${error.message}`);
    throw new Error('Failed to generate itinerary');
  }
};

const chatWithAI = async (messages) => {
  try {
    if (process.env.AI_PROVIDER === 'openai') {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are Travel Buddy, a helpful AI travel assistant. Help users plan trips, answer travel questions, and give destination recommendations. Keep responses concise and friendly.',
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        { headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` } }
      );
      return response.data.choices[0].message.content;
    }

    return "I'm Travel Buddy! I can help you plan your perfect trip. What destination are you thinking of?";
  } catch (error) {
    logger.error(`AI chat error: ${error.message}`);
    throw new Error('AI assistant is temporarily unavailable');
  }
};

module.exports = { generateItinerary, chatWithAI };
