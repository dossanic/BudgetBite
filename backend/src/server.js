require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/ingredients", require("./routes/ingredients"));

app.get("/", (req, res) => {
  res.json({ message: "BudgetBite server is running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
