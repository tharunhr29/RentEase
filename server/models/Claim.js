const mongoose = require("mongoose")

const claimSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  type: {
    type: String,
    enum: ["Damage", "Dispute", "Loss", "Other"],
    default: "Damage"
  },
  description: {
    type: String,
    required: true
  },
  evidence: [String], // URLs to images if any
  status: {
    type: String,
    enum: ["Pending", "Investigating", "Settled", "Dismissed"],
    default: "Pending"
  },
  resolutionNotes: String
}, { timestamps: true })

module.exports = mongoose.model("Claim", claimSchema)
