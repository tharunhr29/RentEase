const ServiceArea = require("../models/ServiceArea")

exports.addServiceArea = async (req, res) => {
  try {
    const area = await ServiceArea.create(req.body)
    res.status(201).json({ success: true, data: area })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.getServiceAreas = async (req, res) => {
  try {
    const areas = await ServiceArea.find().sort("name")
    res.json({ success: true, data: areas })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.toggleServiceArea = async (req, res) => {
  try {
    const area = await ServiceArea.findById(req.params.id)
    area.isActive = !area.isActive
    await area.save()
    res.json({ success: true, data: area })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
