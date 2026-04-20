const mongoose = require("mongoose")

// =====================================================
// ⭐ REVIEW SCHEMA
// =====================================================
const reviewSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {
    type: String
  }

}, { timestamps: true })


// =====================================================
// 🚀 PRODUCT SCHEMA
// =====================================================
const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  category: {
    type: String,
    required: true,
    index: true
  },

  brand: {
    type: String,
    default: "Generic"
  },

  price: {
    type: Number,
    required: true
  },

  deposit: {
    type: Number,
    required: true
  },

  discount: {
    type: Number,
    default: 0
  },

  tenureOptions: {
    type: [Number],
    default: [3, 6, 12]
  },

  image: {
    type: String,
    default: ""
  },

  description: String,
  dimensions: String,
  material: String,

  // 🌍 MULTI-CITY SUPPORT
  cityAvailability: {
    type: [String],
    default: ["Mysore"]
  },

  deliveryCharge: {
    type: Number,
    default: 0
  },

  maintenanceIncluded: {
    type: Boolean,
    default: true
  },

  // =====================================================
  // 🔥 INVENTORY SYSTEM (IMPORTANT)
  // =====================================================

  stock: {
    type: Number,
    default: 1
  },

  availableStock: {
    type: Number,
    default: 1
  },

  reservedStock: {
    type: Number,
    default: 0
  },

  isOutOfStock: {
    type: Boolean,
    default: false
  },

  // =====================================================
  // ⭐ RATINGS SYSTEM
  // =====================================================

  ratings: {
    type: Number,
    default: 0
  },

  numReviews: {
    type: Number,
    default: 0
  },

  reviews: [reviewSchema]

}, { timestamps: true })


const extraProductSchema = new mongoose.Schema({

  name: {
    type: String
  },

  category: String,

  price: Number,

  deposit: Number,

  tenureOptions: [Number],

  stock: {
    type: Number,
    default: 1
  },

  image: String,

  available: {
    type: Boolean,
    default: true
  }

}, { timestamps: true })

// =====================================================
// 🔥 AUTO UPDATE STOCK STATUS
// =====================================================
productSchema.pre("save", async function () {
  this.isOutOfStock = this.availableStock <= 0
})


// =====================================================
// ⭐ CALCULATE RATINGS
// =====================================================
productSchema.methods.calculateRatings = function () {

  if (this.reviews.length === 0) {
    this.ratings = 0
    this.numReviews = 0
  } else {
    this.numReviews = this.reviews.length

    this.ratings =
      this.reviews.reduce((sum, r) => sum + r.rating, 0) /
      this.reviews.length
  }
}


// =====================================================
// ⚡ INDEXES (PERFORMANCE BOOST)
// =====================================================
productSchema.index({ category: 1, cityAvailability: 1 })
productSchema.index({ price: 1 })


module.exports = mongoose.model("Product", productSchema)