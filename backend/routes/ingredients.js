// Dependencies
const express = require("express");
const {
  getSingleRecipe,
  getPriceEstimate,
} = require("../controllers/ingredientsController");

// Create router and define routes
const router = express.Router();
router.get("/", getSingleRecipe);
router.post("/price", getPriceEstimate);

module.exports = router;
