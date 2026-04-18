const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

userEmail:{
type:String,
required:true
},

products:[
{
productId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Product"
},

name:String,
price:Number,
image:String,

quantity:{
type:Number,
default:1
}

}
],

tenure:{
type:Number
},

amount:{
type:Number,
required:true
},

paymentId:{
type:String
},

orderId:{
type:String
},

paymentMethod:{
type:String,
default:"Razorpay"
},

// Address Details
address:{
name:String,
phone:String,
street:String,
city:String,
pincode:String
},

// Delivery Scheduling
deliveryDate:{
type:String
},

deliverySlot:{
type:String,
enum:["9AM-12PM","12PM-3PM","3PM-6PM"]
},

// Pickup Scheduling (for returns)
pickupDate:{
type:String
},

pickupSlot:{
type:String,
enum:["9AM-12PM","12PM-3PM","3PM-6PM"]
},

// Payment Status
status:{
type:String,
enum:["Pending","Paid","Cancelled","Completed"],
default:"Paid"
},

// 🚀 MAIN TRACKING STATUS (NEW)
trackingStatus:{
type:String,
enum:[
"placed",
"shipped",
"out_for_delivery",
"delivered",
"active",
"return_requested",
"picked_up",
"completed"
],
default:"placed"
},

// 🚀 TIMELINE HISTORY (VERY IMPORTANT)
trackingTimeline:[
{
status:String,
date:{
type:Date,
default:Date.now
}
}
],

 // 🚀 Damage Monitoring
 damageReport:{
   type:String,
   default:""
 }

},{timestamps:true})

module.exports = mongoose.model("Order", orderSchema)