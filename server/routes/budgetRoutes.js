const express = require("express");
const router = express.Router();

const {
  estimateBudget,
} = require("../controllers/budgetController");

router.post(
  "/estimate",
  estimateBudget
);

module.exports = router;