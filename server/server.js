require("dotenv").config()
const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])

console.log("EMAIL:", process.env.EMAIL_USER)
console.log("PASS:", process.env.EMAIL_PASS)

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const paymentRoutes = require("./routes/paymentRoutes")
const orderRoutes = require("./routes/orderRoutes")
const authRoutes = require("./routes/authRoutes")
const isAdmin = require("./middleware/isAdmin");
const adminRoutes = require("./routes/adminRoutes")


const app = express()
const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: 100
})

app.use(limiter)

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/auth",require("./routes/authRoutes"))
app.use("/api/products",require("./routes/productRoutes"))
app.use("/api/rentals",require("./routes/rentalRoutes"))
app.use("/api/maintenance",require("./routes/maintenanceRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))
app.use("/api/payment", paymentRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin", adminRoutes)

const morgan = require("morgan")

app.use(morgan("dev"))
const helmet = require("helmet")

const errorHandler = require("./middleware/errorMiddleware")

app.use(errorHandler)

app.use(helmet())
app.get("/",(req,res)=>{
res.send("RentEase API Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
console.log(`Server running on ${PORT}`)
})