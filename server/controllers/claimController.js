const Claim = require("../models/Claim")

exports.createClaim = async (req, res) => {
  try {
    const claim = await Claim.create(req.body)
    res.status(201).json({ success: true, data: claim })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("orderId", "orderId")
      .populate("userId", "name email")
      .populate("productId", "name")
      .sort("-createdAt")
    res.json({ success: true, data: claims })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.updateClaimStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status, resolutionNotes },
      { new: true }
    )
    res.json({ success: true, data: claim })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
