const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({

service: "gmail",

auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS
}

})

// Verify connection
transporter.verify(function (error, success) {

if (error) {
console.log("Email Server Error:", error)
} else {
console.log("Email server ready")
}

})

module.exports = transporter