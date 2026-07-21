// Dependencies
const express = require('express');
const { getRecipes, getRecipeById } = require('../controllers/recipesController');

// Create router and define routes
const router = express.Router();
router.get('/', getRecipes);
router.get('/:id', getRecipeById);

module.exports = router;
