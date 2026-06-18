// Dependencies
const express = require("express");
const recipesRouter = require("./routes/recipes");
const ingredientsRouter = require("./routes/ingredients");
const missingIngredientsRouter = require("./routes/missingIngredients");
const { port } = require("./config");

const app = express();
app.use(express.json());

// Routes
app.use("/recipes", recipesRouter);
app.use("/ingredients", ingredientsRouter); // Deprecated -- please use /missing-ingredients instead
app.use("/missing-ingredients", missingIngredientsRouter);

// Start the server
app.listen(port, (err) => {
  if (!err) {
    console.log(`Server is running on port ${port}`);
  } else {
    console.error(err);
    process.exit(1); // Failure
  }
});
