const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const transporter = require("../config/mailer")

// Temporary OTP storage
let otpStore = {}


/* ================================
   REGISTER USER
================================ */

exports.register = async (req, res) => {

try {

const { name, email, password } = req.body

const existingUser = await User.findOne({ email })

if (existingUser) {
return res.status(400).json({ message: "User already exists" })
}

const hashedPassword = await bcrypt.hash(password, 10)

const user = new User({
name,
email,
password: hashedPassword
})

await user.save()

res.json({
success: true,
message: "User registered successfully"
})

} catch (error) {

console.log(error)
res.status(500).json({ message: "Server error" })

}

}


/* ================================
   LOGIN USER
================================ */

exports.login = async (req, res) => {

try {

const { email, password } = req.body

const user = await User.findOne({ email })

if (!user) {
return res.status(400).json({ message: "User not found" })
}

const validPassword = await bcrypt.compare(password, user.password)

if (!validPassword) {
return res.status(400).json({ message: "Invalid password" })
}

const token = jwt.sign(
{ id: user._id, role: user.role },
process.env.JWT_SECRET,
{ expiresIn: "1d" }
)

res.json({
success: true,
token,
user
})

} catch (error) {

console.log(error)
res.status(500).json({ message: "Server error" })

}

}


/* ================================
   SEND EMAIL OTP
================================ */

exports.sendOTP = async (req, res) => {

try {

const { email } = req.body

if (!email) {
return res.status(400).json({ message: "Email required" })
}

const currentTime = Date.now()

// CHECK EXISTING OTP RECORD
if (otpStore[email]) {

const record = otpStore[email]

// 60s cooldown
if (currentTime - record.lastSent < 60000) {
return res.status(429).json({
message: "Please wait 60 seconds before requesting another OTP"
})
}

// 3 OTP limit per 5 minutes
if (
record.requestCount >= 3 &&
currentTime - record.firstRequestTime < 5 * 60 * 1000
) {
return res.status(429).json({
message: "OTP request limit reached. Try again after 5 minutes."
})
}

// reset after 5 minutes
if (currentTime - record.firstRequestTime > 5 * 60 * 1000) {
record.requestCount = 0
record.firstRequestTime = currentTime
}

}

// GENERATE OTP
const otp = Math.floor(100000 + Math.random() * 900000)

// SAVE OTP
otpStore[email] = {
otp,
expires: currentTime + 5 * 60 * 1000,
requestCount: otpStore[email] ? otpStore[email].requestCount + 1 : 1,
firstRequestTime: otpStore[email]?.firstRequestTime || currentTime,
lastSent: currentTime
}

// SEND EMAIL
await transporter.sendMail({

from: `RentEase <${process.env.EMAIL_USER}>`,
to: email,
subject: "RentEase Email Verification",

html: `
<div style="font-family:Arial">
<h2>RentEase Email Verification</h2>
<p>Your verification OTP is:</p>
<h1 style="color:#2563eb">${otp}</h1>
<p>This code will expire in 5 minutes.</p>
</div>
`

})

console.log("OTP Sent:", otp)

res.json({
success: true,
message: "OTP sent successfully"
})

} catch (error) {

console.log(error)

res.status(500).json({
message: "Failed to send OTP"
})

}

}


/* ================================
   RESEND OTP
================================ */

exports.resendOTP = async (req, res) => {

try {

const { email } = req.body

if (!email) {
return res.status(400).json({ message: "Email required" })
}

// simply call sendOTP logic
req.body.email = email
return exports.sendOTP(req, res)

} catch (error) {

console.log(error)

res.status(500).json({
message: "Failed to resend OTP"
})

}

}


/* ================================
   FORGOT PASSWORD
================================ */

exports.forgotPassword = async (req, res) => {

try {

const { email } = req.body

const user = await User.findOne({ email })

if (!user) {
return res.status(404).json({ message: "User not found" })
}

// reuse OTP sending logic
req.body.email = email
return exports.sendOTP(req, res)

} catch (error) {

console.log(error)
res.status(500).json({ message: "Server error" })

}

}


/* ================================
   VERIFY RESET OTP
================================ */

exports.verifyResetOTP = (req, res) => {

const { email, otp } = req.body

const storedOTP = otpStore[email]

if (!storedOTP) {
return res.status(400).json({ message: "OTP not found" })
}

if (storedOTP.expires < Date.now()) {

delete otpStore[email]

return res.status(400).json({ message: "OTP expired" })

}

if (storedOTP.otp == otp) {

return res.json({
success: true,
message: "OTP verified"
})

}

res.status(400).json({
message: "Invalid OTP"
})

}


/* ================================
   RESET PASSWORD
================================ */

exports.resetPassword = async (req, res) => {

try {

const { email, password } = req.body

const user = await User.findOne({ email })

if (!user) {
return res.status(404).json({ message: "User not found" })
}

const hashedPassword = await bcrypt.hash(password, 10)

user.password = hashedPassword

await user.save()

delete otpStore[email]

res.json({
success: true,
message: "Password reset successfully"
})

} catch (error) {

console.log(error)
res.status(500).json({ message: "Server error" })

}

}


/* ================================
   VERIFY OTP
================================ */

exports.verifyOTP = (req, res) => {

const { email, otp } = req.body

if (!email || !otp) {
return res.status(400).json({ message: "Email and OTP required" })
}

const storedOTP = otpStore[email]

if (!storedOTP) {
return res.status(400).json({
success:false,
message:"OTP not found or expired"
})
}

if (storedOTP.expires < Date.now()) {

delete otpStore[email]

return res.status(400).json({
success:false,
message:"OTP expired"
})

}

if (storedOTP.otp == otp) {

delete otpStore[email]

return res.json({
success: true,
message: "OTP verified successfully"
})

}

res.status(400).json({
success: false,
message: "Invalid OTP"
})

}