// Dependencies
const express = require('express');
const recipesRouter = require('./routes/recipes');
const ingredientsRouter = require('./routes/ingredients');
const { port } = require('./config');

const app = express();

// Routes
app.use('/recipes', recipesRouter);
app.use('/ingredients', ingredientsRouter);

// Start the server
app.listen(port, (err) => {
    if (!err) {
        console.log(`Server is running on port ${port}`);
    } else {
        console.error(err);
        process.exit(1); // Failure
    }
});
