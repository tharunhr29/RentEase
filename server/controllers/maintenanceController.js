const Maintenance = require("../models/Maintenance")

exports.createRequest = async(req,res)=>{

const request = new Maintenance(req.body)

await request.save()

res.json(request)

}

exports.getRequests = async(req,res)=>{

const requests = await Maintenance.find()
.populate("userId")
.populate("productId")

res.json(requests)

}

exports.updateStatus = async(req,res)=>{

const request = await Maintenance.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
)

res.json(request)

}