const Product = require("../models/Product")

exports.addReview = async (req, res) => {

const product = await Product.findById(req.params.id)

if (!product) {
return res.status(404).json({ message: "Product not found" })
}

const review = {
user: req.user.id,
rating: req.body.rating,
comment: req.body.comment
}

product.reviews.push(review)

product.numReviews = product.reviews.length

product.ratings =
product.reviews.reduce((acc, item) => acc + item.rating, 0) /
product.reviews.length

await product.save()

res.json(product)

}