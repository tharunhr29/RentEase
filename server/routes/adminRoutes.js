const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { sendEmail } = require("../utils/sendEmail")

// CONTROLLERS
const adminUserController = require("../controllers/adminUserController")
const claimController = require("../controllers/claimController")
const serviceAreaController = require("../controllers/serviceAreaController")

// MIDDLEWARE
const verifyToken = require("../middleware/authMiddleware")
const { isAdmin } = require("../middleware/adminMiddleware")

// ===============================
// 🔐 PASSWORD REGEX
// ===============================
const strongPassword =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/


// ===============================
// ✅ ADMIN REGISTER
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" })
    }

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must include uppercase, lowercase, number, special character"
      })
    }

    let existing = await User.findOne({ email })

    if (existing && existing.isVerified) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    if (existing && !existing.isVerified) {
      existing.password = hashedPassword
      existing.otp = otp
      existing.otpExpiry = Date.now() + 5 * 60 * 1000
      existing.name = name
      existing.role = "admin"

      await existing.save()
    } else {
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000,
        isVerified: false
      })
    }

    await sendEmail(email, otp)

    res.json({
      success: true,
      message: "OTP sent to email",
      data: { email }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// ===============================
// ✅ VERIFY OTP
// ===============================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })

    if (!user || user.role !== "admin") {
      return res.status(400).json({ message: "Admin not found" })
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    user.isVerified = true
    user.otp = null
    user.otpExpiry = null

    await user.save()

    res.json({
      success: true,
      message: "Admin verified successfully"
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// ===============================
// ✅ ADMIN LOGIN (🔥 MISSING FIX)
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await User.findOne({ email })

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" })
    }

    // 🔒 Must verify email first
    if (!admin.isVerified) {
      return res.status(401).json({ message: "Please verify email first" })
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        email: admin.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
// ===============================
// ✅ ADMIN STATS (FIX)
// ===============================
router.get("/stats", async (req, res) => {
  try {
    const User = require("../models/User")
    const Order = require("../models/Order")
    const Product = require("../models/Product")

    const totalUsers = await User.countDocuments({ role: "user" })
    const totalAdmins = await User.countDocuments({ role: "admin" })
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()

    const orders = await Order.find({ status: "Paid" })
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0)
    const activeRentals = await Order.countDocuments({ trackingStatus: "active" })

    // Category Analytics
    const products = await Product.find()
    const categoryStats = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {})

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalOrders,
        totalProducts,
        totalRevenue,
        activeRentals,
        categoryStats
      }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user || user.role !== "admin") {
      return res.status(400).json({ message: "Admin not found" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    user.resetToken = otp
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000

    await user.save()

    await sendEmail(email, otp)

    res.json({ success: true, message: "Reset OTP sent" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" })
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message: "Password must be strong"
      })
    }

    const user = await User.findOne({ email })

    if (!user || user.resetToken !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    const hashed = await bcrypt.hash(password, 10)

    user.password = hashed
    user.resetToken = null
    user.resetTokenExpiry = null

    await user.save()

    res.json({ success: true, message: "Password reset successful" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" })
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

    if (!strongPassword.test(password)) {
      return res.status(400).json({ message: "Weak password" })
    }

    const user = await User.findOne({ email })

    if (!user || user.role !== "admin") {
      return res.status(400).json({ message: "Admin not found" })
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    const hashed = await bcrypt.hash(password, 10)

    user.password = hashed
    user.isVerified = true
    user.otp = null
    user.otpExpiry = null

    await user.save()

    res.json({
      success: true,
      message: "Admin verified & password set successfully"
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// =====================================================
// 👥 USER MANAGEMENT
// =====================================================
router.get("/users", verifyToken, isAdmin, adminUserController.getAllUsers)
router.put("/users/:id/role", verifyToken, isAdmin, adminUserController.updateUserRole)
router.delete("/users/:id", verifyToken, isAdmin, adminUserController.deleteUser)

// =====================================================
// 🏛️ SERVICE AREAS
// =====================================================
router.get("/service-areas", serviceAreaController.getServiceAreas)
router.post("/service-areas", verifyToken, isAdmin, serviceAreaController.addServiceArea)
router.put("/service-areas/:id/toggle", verifyToken, isAdmin, serviceAreaController.toggleServiceArea)

// =====================================================
// ⚖️ DISPUTES & CLAIMS
// =====================================================
router.get("/claims", verifyToken, isAdmin, claimController.getAllClaims)
router.post("/claims", verifyToken, isAdmin, claimController.createClaim)
router.put("/claims/:id", verifyToken, isAdmin, claimController.updateClaimStatus)

module.exports = router