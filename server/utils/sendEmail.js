const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tharunhrmys29@gmail.com",
    pass: "xybdngpvrabtabma"
  }
})

const sendEmail = async (email, otp) => {
  await transporter.sendMail({
    to: email,
    subject: "Admin Verification OTP",
    html: `<h2>Your OTP is: ${otp}</h2>`
  })
}

module.exports = { sendEmail }