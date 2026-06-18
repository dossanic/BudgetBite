// Dependencies
const express = require('express');
const { getMissingIngredients } = require('../controllers/missingIngredientsController');

// Create router and define routes
const router = express.Router();
router.get('/', getMissingIngredients);

module.exports = router;
