const router = require("express").Router()

const { 
register, 
login, 
sendOTP, 
verifyOTP,
resendOTP,
forgotPassword,
verifyResetOTP,
resetPassword
} = require("../controllers/authController")

// Register user
router.post("/register", register)

// Login user
router.post("/login", login)

// Send email OTP
router.post("/send-otp", sendOTP)

// Verify OTP
router.post("/verify-otp", verifyOTP)

// Resend OTP
router.post("/resend-otp", resendOTP)

// Forgot password (send reset OTP)
router.post("/forgot-password", forgotPassword)

// Verify reset OTP
router.post("/verify-reset-otp", verifyResetOTP)

// Reset password
router.post("/reset-password", resetPassword)

module.exports = router