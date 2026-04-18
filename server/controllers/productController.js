const Product = require("../models/Product")
const Rental = require("../models/Rental")
const { products: fallbackProducts } = require("../seed/seedProducts")

// =====================================================
// ✅ GET ALL PRODUCTS (SEARCH + FILTER + PAGINATION)
// =====================================================
exports.getProducts = async (req, res) => {
  try {
    // Check if database is connected
    const isConnected = require("mongoose").connection.readyState === 1

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    const search = req.query.search || ""
    const category = req.query.category

    let products = []
    let total = 0

    if (isConnected) {
      console.log("Fetching products from Live Database...")
      let query = {
        name: { $regex: search, $options: "i" }
      }

      if (category) query.category = category
      query.availableStock = { $gt: 0 }

      products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()

      total = await Product.countDocuments(query)
    }

    // ⭐ FALLBACK LOGIC: If DB is empty or disconnected, use seed data
    if (!isConnected || products.length === 0) {
      console.log("Using Fallback Data (Seed Products)...")
      
      let filtered = fallbackProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (category ? p.category === category : true)
      )

      total = filtered.length
      products = filtered.slice(skip, skip + limit)
    }

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      products
    })

  } catch (error) {
    console.error("Get Products Error:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}


// =====================================================
// ✅ GET SINGLE PRODUCT
// =====================================================
exports.getProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id).lean()

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    res.json({
      success: true,
      product
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


// =====================================================
// ✅ CREATE PRODUCT (ADMIN)
// =====================================================
exports.createProduct = async (req, res) => {
  try {

    const {
      name,
      category,
      price,
      deposit,
      description,
      stock,
      cityAvailability
    } = req.body

    const image = req.file ? req.file.path : ""

    const product = await Product.create({
      name,
      category,
      price,
      deposit,
      image,
      description,
      stock,
      availableStock: stock,
      cityAvailability
    })

    res.status(201).json({
      success: true,
      message: "Product created",
      product
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


// =====================================================
// ✅ UPDATE PRODUCT (SAFE UPDATE)
// =====================================================
exports.updateProduct = async (req, res) => {
  try {

    const updates = req.body

    if (req.file) {
      updates.image = req.file.path
    }

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    // Prevent invalid stock updates
    if (updates.stock !== undefined) {
      const difference = updates.stock - product.stock
      updates.availableStock = product.availableStock + difference
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )

    res.json({
      success: true,
      message: "Product updated",
      product: updated
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


// =====================================================
// ✅ DELETE PRODUCT
// =====================================================
exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    await product.deleteOne()

    res.json({
      success: true,
      message: "Product deleted"
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


// =====================================================
// 🔥 POPULAR PRODUCTS (MOST RENTED)
// =====================================================
exports.getPopularProducts = async (req, res) => {
  try {

    const popular = await Rental.aggregate([
      {
        $group: {
          _id: "$productId",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    // Fetch full product data
    const productIds = popular.map(p => p._id)

    const products = await Product.find({
      _id: { $in: productIds }
    }).lean()

    res.json({
      success: true,
      products
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


// =====================================================
// 🔥 TRENDING PRODUCTS (RECENT ACTIVITY)
// =====================================================
exports.getTrendingProducts = async (req, res) => {
  try {

    const trending = await Rental.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("productId")
      .lean()

    const products = trending.map(t => t.productId)

    res.json({
      success: true,
      products
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}