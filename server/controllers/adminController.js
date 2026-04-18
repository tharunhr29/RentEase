const User = require("../models/User")
const Order = require("../models/Order")
const Product = require("../models/Product")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { sendEmail } = require("../utils/sendEmail")

// ===============================
// 🔐 PASSWORD REGEX
// ===============================
const strongPassword =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/


// ===============================
// ✅ CREATE ADMIN (WITH OTP)
// ===============================
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    // ✅ Validate fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields required" })
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

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const hashed = await bcrypt.hash(password, 10)

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      isVerified: false
    })

    // 📧 Send OTP email
    await sendEmail(email, otp)

    res.json({
      success: true,
      message: "OTP sent to email",
      data: { email }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// ✅ VERIFY ADMIN OTP
// ===============================
const verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const admin = await User.findOne({ email })

    if (!admin || admin.role !== "admin") {
      return res.status(400).json({ message: "Admin not found" })
    }

    if (admin.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    admin.isVerified = true
    admin.otp = null
    admin.otpExpiry = null

    await admin.save()

    res.json({
      success: true,
      message: "Admin verified successfully"
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// ✅ LOGIN ADMIN
// ===============================
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await User.findOne({ email })

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" })
    }

    // 🔒 CHECK EMAIL VERIFIED
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
      { expiresIn: "7d" } // ✅ Better security
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
}


// ===============================
// ✅ ADMIN STATS
// ===============================
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" })
    const totalAdmins = await User.countDocuments({ role: "admin" })
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalOrders,
        totalProducts
      }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// 🔥 FINAL EXPORT
// ===============================
module.exports = {
  createAdmin,
  verifyAdminOTP,
  loginAdmin,
  getAdminStats
}