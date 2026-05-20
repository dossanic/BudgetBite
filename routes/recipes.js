// Dependencies
const express = require('express');
const { getRecipes } = require('../controllers/recipesController');

// Create router and define routes
const router = express.Router();
router.get('/', getRecipes);

module.exports = router;
