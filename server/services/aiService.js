const axios = require("axios");
const logger = require("../utils/logger");

const generateItinerary = async ({
  city,
  days,
  travelers,
  preferences,
  budgetType,
}) => {
  const prompt = `
Create a detailed ${days}-day travel itinerary for ${city}.

Travelers:
${travelers?.adults || 1} adults,
${travelers?.children || 0} children.

Budget Category:
${budgetType || "mid-range"}.

Preferences:
${preferences || "general sightseeing, local food, culture"}.

IMPORTANT:

If budget is "budget":
- Use hostels or cheap hotels
- Prefer buses and local transport
- Suggest street food and free attractions.

If budget is "mid-range":
- Use 3-star hotels
- Mix of taxis and public transport
- Mid-range restaurants and paid attractions.

If budget is "luxury":
- Use premium hotels
- Private cabs and premium experiences
- Fine dining restaurants.

Return ONLY VALID JSON.

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
          "category": "Historical",
          "description": "Brief description",
          "estimatedDuration": "2 hours",
          "bestTimeToVisit": "Morning",
          "travelTimeFromPrev": 15,
          "estimatedCost": 500
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
}
`;

  const budgetMap = {
    budget: {
      hotel: 1500,
      food: 500,
      activities: 300,
      transport: 800,
    },

    "mid-range": {
      hotel: 4000,
      food: 1200,
      activities: 800,
      transport: 1500,
    },

    luxury: {
      hotel: 10000,
      food: 3000,
      activities: 2500,
      transport: 5000,
    },
  };

  const rates =
    budgetMap[budgetType] ||
    budgetMap["mid-range"];

  try {
    if (
      process.env.AI_PROVIDER ===
      "zenmux"
    ) {
      const response =
        await axios.post(
          "https://zenmux.ai/api/v1/chat/completions",
          {
            model:
              "x-ai/grok-4.5-free",

            messages: [
              {
                role: "system",
                content:
                  "You are a professional travel planner. Always respond with valid JSON only.",
              },
              {
                role: "user",
                content:
                  prompt,
              },
            ],

            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.ZENMUX_API_KEY}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      const content =
        response.data
          .choices[0]
          .message.content;

      const cleaned =
        content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      const match =
        cleaned.match(
          /\{[\s\S]*\}/
        );

      if (!match) {
        throw new Error(
          "Invalid AI response"
        );
      }

      return JSON.parse(
        match[0]
      );
    }

    // Development fallback
    return {
      title: `${days}-Day ${city} Adventure`,

      summary: `An exciting ${days}-day trip to ${city}.`,

      days: Array.from(
        { length: days },
        (_, i) => ({
          dayNumber: i + 1,

          theme: `Day ${
            i + 1
          } - Explore ${city}`,

          places: [
            {
              name: `Top Attraction ${
                i + 1
              }`,
              category:
                "Historical",
              description:
                "A must visit place.",
              estimatedDuration:
                "2 hours",
              bestTimeToVisit:
                "Morning",
              travelTimeFromPrev: 20,
              estimatedCost: 500,
            },

            {
              name: `Food Spot ${
                i + 1
              }`,
              category:
                "Food",
              description:
                "Popular local food destination.",
              estimatedDuration:
                "1 hour",
              bestTimeToVisit:
                "Afternoon",
              travelTimeFromPrev: 15,
              estimatedCost: 300,
            },
          ],

          notes:
            "Carry water and comfortable shoes.",
        })
      ),

      estimatedBudget: {
        hotel:
          rates.hotel *
          days,

        transport:
          rates.transport,

        food:
          rates.food *
          days,

        activities:
          rates.activities *
          days,
      },
    };
  } catch (error) {
    logger.error(
      `AI itinerary error: ${error.message}`
    );

    throw new Error(
      "Failed to generate itinerary"
    );
  }
};

const chatWithAI = async (
  messages
) => {
  try {
    if (
      process.env.AI_PROVIDER ===
      "zenmux"
    ) {
      const response =
        await axios.post(
          "https://zenmux.ai/api/v1/chat/completions",
          {
            model:
              "x-ai/grok-4.5-free",

            messages: [
              {
                role: "system",
                content:
                  "You are Travel Buddy, a helpful AI travel assistant.",
              },

              ...messages,
            ],

            temperature: 0.7,
            max_tokens: 500,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.ZENMUX_API_KEY}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      return response.data
        .choices[0]
        .message.content;
    }

    return "I'm Travel Buddy! How can I help you?";
  } catch (error) {
    logger.error(
      `AI chat error: ${error.message}`
    );

    throw new Error(
      "AI assistant is temporarily unavailable"
    );
  }
};

module.exports = {
  generateItinerary,
  chatWithAI,
};