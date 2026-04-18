const Order = require("../models/Order")

// =====================================================
// ✅ STATUS FLOW CONTROL (IMPORTANT 🔥)
// =====================================================
const statusFlow = [
  "placed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "active",
  "return_requested",
  "picked_up",
  "completed"
]

// =====================================================
// ✅ CREATE ORDER
// =====================================================
exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      amount,
      paymentId,
      address,
      deliveryDate,
      deliverySlot,
      tenure
    } = req.body

    if (!req.user || !req.user.email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products are required" })
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" })
    }

    if (!address || !address.phone || !address.pincode) {
      return res.status(400).json({ message: "Complete address required" })
    }

    if (!deliveryDate || !tenure) {
      return res.status(400).json({ message: "Delivery date & tenure required" })
    }

    const delivery = new Date(deliveryDate)

    if (isNaN(delivery.getTime())) {
      return res.status(400).json({ message: "Invalid delivery date" })
    }

    const pickup = new Date(delivery)
    pickup.setMonth(pickup.getMonth() + tenure)

    const customOrderId = "RENT-" + Date.now()

    const order = await Order.create({
      userEmail: req.user.email,
      products,
      amount,
      paymentId,
      orderId: customOrderId,
      address,
      deliveryDate: delivery,
      deliverySlot,
      pickupDate: pickup,
      tenure,
      status: "Paid",
      trackingStatus: "placed",
      trackingTimeline: [
        {
          status: "placed",
          date: new Date()
        }
      ]
    })

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    })

  } catch (err) {
    console.error("Create Order Error:", err)

    res.status(500).json({
      success: false,
      message: "Order creation failed"
    })
  }
}


// =====================================================
// ✅ GET SINGLE ORDER
// =====================================================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    res.json({
      success: true,
      order
    })

  } catch (err) {
    console.error("Get Order Error:", err)

    res.status(500).json({
      success: false,
      message: "Failed to fetch order"
    })
  }
}


// =====================================================
// ✅ GET ALL ORDERS (ADMIN)
// =====================================================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      count: orders.length,
      orders
    })

  } catch (err) {
    console.error("Get Orders Error:", err)

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    })
  }
}


// =====================================================
// ✅ UPDATE TRACKING STATUS (SMART FLOW 🔥)
// =====================================================
exports.updateTrackingStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!statusFlow.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    const currentIndex = statusFlow.indexOf(order.trackingStatus)
    const newIndex = statusFlow.indexOf(status)

    if (newIndex !== currentIndex + 1) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition. Next: ${statusFlow[currentIndex + 1]}`
      })
    }

    order.trackingStatus = status

    order.trackingTimeline.push({
      status,
      date: new Date()
    })

    await order.save()

    res.json({
      success: true,
      message: "Tracking updated successfully",
      order
    })

  } catch (err) {
    console.error("Update Tracking Error:", err)

    res.status(500).json({
      success: false,
      message: "Failed to update tracking"
    })
  }
}


// =====================================================
// ✅ ADMIN API (ADVANCED)
// =====================================================
exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "email")
      .populate("products.product", "name price")

    res.json({
      success: true,
      data: { orders }
    })

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, damageReport } = req.body

    const order = await Order.findById(req.params.id)

    if (status) order.trackingStatus = status
    if (damageReport !== undefined) order.damageReport = damageReport

    if (status) {
      order.trackingTimeline.push({
        status,
        date: new Date()
      })
    }

    await order.save()

    res.json({
      success: true,
      data: { order }
    })

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}


// =====================================================
// 🔥🔥🔥 FINAL FIX (ALIAS FOR ROUTES)
// =====================================================

// 👉 THESE FIX YOUR ERROR
exports.getOrders = exports.getAllOrdersAdmin
exports.updateOrder = exports.updateOrderStatus