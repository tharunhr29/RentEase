const express = require("express")
const router = express.Router()

// CONTROLLERS
const orderController = require("../controllers/orderController")

// MIDDLEWARE
const { verifyToken } = require("../middleware/authMiddleware")
const { isAdmin } = require("../middleware/adminMiddleware")

// =====================================================
// ✅ CREATE ORDER (USER)
// =====================================================
router.post("/", orderController.createOrder)


// =====================================================
// ✅ GET ORDERS BY USER EMAIL (USER DASHBOARD)
// =====================================================
router.get("/user/:email", async (req, res) => {
  try {

    const orders = await require("../models/Order")
      .find({ userEmail: req.params.email })
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      count: orders.length,
      orders
    })

  } catch (error) {

    console.error("User Orders Error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    })
  }
})


// =====================================================
// 🔥 ADMIN: GET ALL ORDERS
// =====================================================
router.get("/admin", verifyToken, isAdmin, orderController.getAllOrdersAdmin)


// =====================================================
// 🔥 ADMIN: UPDATE TRACKING STATUS
// =====================================================
router.put("/tracking/:id", verifyToken, isAdmin, orderController.updateOrderStatus)


// =====================================================
// ✅ GET SINGLE ORDER (TRACKING PAGE)
// =====================================================
router.get("/:id", orderController.getOrderById)


module.exports = router