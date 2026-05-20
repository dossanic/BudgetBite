// Dependencies
const express = require('express');
const { getIngredients } = require('../controllers/ingredientsController');

// Create router and define routes
const router = express.Router();
router.get('/', getIngredients);

module.exports = router;
