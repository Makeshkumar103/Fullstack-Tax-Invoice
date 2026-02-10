require("dotenv").config();
const express = require("express");
const cors = require("cors");

const companyRoutes = require("./routes/companyRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/companies", companyRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
