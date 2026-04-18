const express = require("express")
const router = express.Router()
const razorpay = require("../config/razorpay")
const crypto = require("crypto")
const Order = require("../models/Order")

// Create Razorpay Order
router.post("/create-order", async (req, res) => {

  try {

    const { amount } = req.body

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcptid_" + Date.now()
    }

    const order = await razorpay.orders.create(options)

    res.json(order)

  } catch (error) {

    console.error(error)

    res.status(500).json({ error: "Order creation failed" })

  }

})


// Verify Payment
router.post("/verify-payment", async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    products,
    amount
  } = req.body

  const body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {

    try {

      // Save order in MongoDB
      const order = new Order({

        userEmail: "customer@email.com",

        products: products,

        amount: amount,

        paymentId: razorpay_payment_id,

        orderId: razorpay_order_id,

        status: "Paid"

      })

      await order.save()

      res.json({ success: true, message: "Payment verified and order saved" })

    } catch (error) {

      console.error(error)

      res.status(500).json({ success: false })

    }

  } else {

    res.status(400).json({
      success: false,
      message: "Payment verification failed"
    })

  }

})

module.exports = router