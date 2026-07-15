const City = require("../models/City");
const estimateBudget = async (
  req,
  res,
  next
) => {
  try {
    const {
  cityId,
  days,
  travelers,
  hotelType,
  transport,
} = req.body;

if (!cityId) {
  return res.status(400).json({
    success: false,
    message: "City ID is required",
  });
}

const city = await City.findById(cityId);

if (!city) {
  return res.status(404).json({
    success: false,
    message: "City not found",
  });
}

const travelerCount =
  Number(travelers?.adults || 0) +
  Number(travelers?.children || 0);

    let hotelRate = 0;

    switch (hotelType) {
      case "budget":
        hotelRate =
          city.hotelBudgetPrice || 1500;
        break;

      case "mid-range":
        hotelRate =
          city.hotelMidRangePrice || 3500;
        break;

      case "luxury":
        hotelRate =
          city.hotelLuxuryPrice || 8000;
        break;

      default:
        hotelRate = 1500;
    }

    const transportRates = {
      bus: 800,
      train: 1500,
      flight: 6000,
    };

    const hotelCost =
      hotelRate *
      Number(days) *
      travelerCount;

    const foodCost =
      (city.averageFoodCostPerDay ||
        800) *
      Number(days) *
      travelerCount;

    const localTransportCost =
      (city.averageLocalTransportPerDay ||
        500) *
      Number(days) *
      travelerCount;

    const travelTransportCost =
      (transportRates[
        transport
      ] || 0) *
      travelerCount;

    const transportCost =
      localTransportCost +
      travelTransportCost;

    const totalBudget =
      hotelCost +
      foodCost +
      transportCost;

    res.json({
  success: true,
  data: {
    city: city.name,
    breakdown: {
      hotel: hotelCost,
      food: foodCost,
      transport: transportCost,
    },
    total: totalBudget,
  },
});
  } catch (error) {
    next(error);
  }
};
module.exports = {
  estimateBudget,
};