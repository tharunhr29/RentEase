const mongoose = require("mongoose")

const maintenanceSchema = new mongoose.Schema({

orderId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Order"
},

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

productId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Product"
},

productName:String,
issue:String,

status:{
type:String,
enum:["Pending","In Progress","Resolved"],
default:"Pending"
}

},{timestamps:true})

module.exports = mongoose.model("Maintenance",maintenanceSchema)