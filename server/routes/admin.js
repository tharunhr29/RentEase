import express from "express"
import adminAuth from "../middleware/adminAuth.js"
import User from "../models/User.js"
import Order from "../models/Order.js"

const router = express.Router()

// ✅ GET ADMIN STATS
router.get("/stats", adminAuth, async (req, res) => {
  try {

    const totalUsers = await User.countDocuments()

    const totalOrders = await Order.countDocuments()

    const activeRentals = await Order.countDocuments({
      status: { $in: ["active"] }
    })

    const revenueData = await Order.find()

    const totalRevenue = revenueData.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    )

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        activeRentals,
        totalRevenue
      }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router