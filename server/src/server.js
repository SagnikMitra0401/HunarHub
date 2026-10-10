require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const entrepreneurRoutes = require("./routes/entrepreneurs");
const productRoutes = require("./routes/products");
const serviceRequestRoutes = require("./routes/serviceRequests");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const adminRoutes = require("./routes/admin");

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow the configured client origin
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api", generalLimiter);

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again in 15 minutes." },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/entrepreneurs", entrepreneurRoutes);
app.use("/api/products", productRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler — never expose internal details to the client
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`HunarHub API running on port ${PORT}`));
