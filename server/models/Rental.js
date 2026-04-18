const mongoose = require("mongoose")

const rentalSchema = new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

product:{
type:mongoose.Schema.Types.ObjectId,
ref:"Product"
},

orderId:{
type:String
},

rentalPlan:{
type:Number // months
},

startDate:{
type:Date,
default:Date.now
},

endDate:{
type:Date
},

status:{
type:String,
default:"active"
},

returnRequested:{
type:Boolean,
default:false
}

},{timestamps:true})

module.exports = mongoose.model("Rental",rentalSchema)