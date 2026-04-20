require("dotenv").config()
const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const morgan = require("morgan")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const errorHandler = require("./middleware/errorMiddleware")

// ROUTES
const paymentRoutes = require("./routes/paymentRoutes")
const orderRoutes = require("./routes/orderRoutes")
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const productRoutes = require("./routes/productRoutes")
const rentalRoutes = require("./routes/rentalRoutes")
const maintenanceRoutes = require("./routes/maintenanceRoutes")

const app = express()

// DB CONNECTION
connectDB()

// MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(helmet())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
})
app.use("/api/", limiter)

// API ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/rentals", rentalRoutes)
app.use("/api/maintenance", maintenanceRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/orders", orderRoutes)

app.get("/", (req, res) => {
  res.send("RentEase API Running")
})

// ERROR HANDLER (Must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})