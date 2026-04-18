const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  phone: String,
  address: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  // ✅ EMAIL VERIFICATION
  isVerified: {
    type: Boolean,
    default: false
  },

  // ✅ OTP SYSTEM
  otp: String,
  otpExpiry: Date,

  // ✅ PASSWORD RESET (future-ready)
  resetToken: String,
  resetTokenExpiry: Date

},
{ timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)