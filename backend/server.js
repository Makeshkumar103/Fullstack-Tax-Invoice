require("dotenv").config();
const express = require("express");
const cors = require("cors");

const companyRoutes = require("./routes/companyRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const seedRoutes = require("./routes/seedRoutes");

const app = express();

// ── Updated CORS configuration ──
// Allow your local dev frontend + prepare for production frontend later
const allowedOrigins = [
  "http://localhost:5173",                    // Vite default port
  "http://localhost:3000",                    // sometimes used
  // Add your deployed frontend URL later, e.g. "https://your-vercel-app.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman) + listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS rejected origin: ${origin}`); // helpful for logs
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // add others if you use them
  credentials: true, // if you ever add cookies/sessions
  optionsSuccessStatus: 204, // some browsers need this
}));

// Explicitly handle ALL OPTIONS preflight requests (critical for Railway!)
app.options("*", cors());  // This uses the same cors() config above

// Now other middleware
app.use(express.json());

// Routes
app.use("/companies", companyRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/seed", seedRoutes);

// Error handling (keep as-is)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Your DB connection file looks fine — keep it separate and imported where needed
// (just make sure routes use the exported db connection)