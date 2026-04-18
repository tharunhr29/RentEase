const mongoose = require("mongoose")
const dns = require("dns")

const connectDB = async () => {
  try {
    dns.setServers(['8.8.8.8'])
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })

    console.log("MongoDB Connected")
  } catch (error) {
    console.error("DB Error:", error)
  }
}

module.exports = connectDB