require("dotenv").config();
const express = require("express");
const cors = require("cors");

const companyRoutes = require("./routes/companyRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const seedRoutes = require("./routes/seedRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/companies", companyRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/seed", seedRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// app.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
