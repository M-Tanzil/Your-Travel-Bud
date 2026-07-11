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

    const city =
      await City.findById(cityId);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

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
      Number(travelers);

    const foodCost =
      (city.averageFoodCostPerDay ||
        800) *
      Number(days) *
      Number(travelers);

    const localTransportCost =
      (city.averageLocalTransportPerDay ||
        500) *
      Number(days) *
      Number(travelers);

    const travelTransportCost =
      (transportRates[
        transport
      ] || 0) *
      Number(travelers);

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
        hotelCost,
        foodCost,
        transportCost,
        totalBudget,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  estimateBudget,
};