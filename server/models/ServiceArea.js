const mongoose = require("mongoose")

const serviceAreaSchema = new mongoose.Schema({
  name: {
    type: String, // e.g., "Mysore", "Bangalore"
    required: true,
    unique: true
  },
  state: String,
  isActive: {
    type: Boolean,
    default: true
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  minOrderValue: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

module.exports = mongoose.model("ServiceArea", serviceAreaSchema)
