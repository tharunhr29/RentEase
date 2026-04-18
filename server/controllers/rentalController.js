const Rental = require("../models/Rental")
const Product = require("../models/Product")


// ================================
// CREATE RENTAL
// ================================

exports.createRental = async (req, res) => {

try {

const { productId, userId, tenure } = req.body

const product = await Product.findById(productId)

if (!product) {
return res.status(404).json({ message: "Product not found" })
}

if (product.availableStock <= 0) {
return res.status(400).json({ message: "Product not available" })
}

const startDate = new Date()

const endDate = new Date()
endDate.setMonth(endDate.getMonth() + tenure)

const rental = new Rental({
productId,
userId,
tenure,
startDate,
endDate,
status: "active",
returnRequested: false
})

await rental.save()

product.availableStock -= 1
await product.save()

res.json(rental)

} catch (error) {

res.status(500).json({ message: error.message })

}

}


// ================================
// GET USER RENTALS
// ================================

exports.getUserRentals = async (req, res) => {

try {

const rentals = await Rental.find({
userId: req.params.userId
})
.populate("productId")

res.json(rentals)

} catch (error) {

res.status(500).json({ message: error.message })

}

}


// ================================
// GET ALL RENTALS (ADMIN)
// ================================

exports.getAllRentals = async (req, res) => {

try {

const rentals = await Rental.find()
.populate("userId")
.populate("productId")

res.json(rentals)

} catch (error) {

res.status(500).json({ message: error.message })

}

}


// ================================
// REQUEST RETURN
// ================================

exports.requestReturn = async (req, res) => {

try {

const rental = await Rental.findById(req.params.id)

if (!rental) {
return res.status(404).json({ message: "Rental not found" })
}

rental.returnRequested = true
rental.status = "return_requested"

await rental.save()

res.json({
message: "Return request submitted"
})

} catch (error) {

res.status(500).json({ message: error.message })

}

}


// ================================
// COMPLETE RENTAL
// ================================

exports.completeRental = async (req, res) => {

try {

const rental = await Rental.findById(req.params.id)

if (!rental) {
return res.status(404).json({ message: "Rental not found" })
}

if (rental.status === "completed") {
return res.status(400).json({ message: "Rental already completed" })
}

rental.status = "completed"

await rental.save()

const product = await Product.findById(rental.productId)

product.availableStock += 1

await product.save()

res.json({
message: "Rental completed successfully"
})

} catch (error) {

res.status(500).json({ message: error.message })

}

}


// ================================
// GET ACTIVE RENTALS
// ================================

exports.getActiveRentals = async (req, res) => {

try {

const rentals = await Rental.find({
status: "active"
})
.populate("userId")
.populate("productId")

res.json(rentals)

} catch (error) {

res.status(500).json({ message: error.message })

}

}