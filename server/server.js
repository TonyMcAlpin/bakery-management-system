const express = require("express");

const cors = require("cors");

require("./database/init");

const ingredientRoutes = require("./routes/ingredients");
const recipeRoutes = require("./routes/recipes");
const purchaseRoutes = require("./routes/purchases");
const salesRoutes = require("./routes/sales");
const reportsRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());



app.use("/ingredients", ingredientRoutes);
app.use("/recipes", recipeRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/sales", salesRoutes);
app.use("/reports", reportsRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Bakery API Running",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

