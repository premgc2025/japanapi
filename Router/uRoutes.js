
const express = require('express')

const mongoose = require('mongoose')
const router = express.Router()

// importing Model
const roomModel = require("../Model/Room")
const gatewayModel = require("../Model/Gateway")
const boothModel = require('../Model/Booth')
const verifyToken = require('../VerifyToken')
const buildingModel = require('../Model/Building')


// Delete Building data
router.delete('/building/:buildingid', verifyToken, async (req, res) => {

  const { buildingid } = req.params;
  try {
    const remainingRoom = await roomModel.countDocuments({ buildingname: buildingid })


    if (remainingRoom > 0) {

      return res.status(400).send({ Message: 'Cannot delete Building; remaining Room associated' });

    }
    // Proceed with deleting the Building
    const result = await buildingModel.deleteOne({
      _id: buildingid,

    })


    if (result.deletedCount === 0) {
      return res.status(404).send({ Message: 'No Building found to delete' });
    }

    res.status(200).send({ Message: 'Building deleted successfully' });
  }

  catch (error) {
    res.status(500).send({ Message: 'Failed to delete Building' });
  }

})

// Get Rooms data

router.get('/room', async (req, res) => {

  try {
    const response = await roomModel.find().populate("buildingname")
    res.status(200).send(response)
  }
  catch (err) {
    res.status(404).send({ Message: " Failed to find data " })
  }
})

// POST Room Data

router.post('/room', verifyToken, async (req, res) => {

  const roomInfo = req.body;

  try {

    const existingRoom = await roomModel.findOne({ buildingname: roomInfo.buildingname, name: roomInfo.name })

    if (!existingRoom) {
      const response = await roomModel.create(roomInfo)
      res.status(200).send({ Message: "Room info created successfully" })

    }
    else {

      res.status(409).send({ Message: "Room already exists in this building" })
    }

  }

  catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error

      res.status(409).send({ Message: "Room already exists in this building -MDB" })
    } else {

      res.status(403).send({ Message: error.message, })
    }
  }

})

// Update Room Data

router.put('/room/:id', verifyToken, async (req, res) => {
  const id = req.params.id
  const roomInfo = req.body

  try {
    if (roomInfo.buildingname.length > 0 && roomInfo.name.length > 0 && roomInfo.floor.length > 0) {
      const response = await roomModel.updateOne({ _id: id }, roomInfo)

      res.status(200).send({ Message: "Update successfully" })

    }
    else {

      res.status(403).send({ Message: "Enter Value" })

    }
  }
  catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error

      res.status(409).send({ Message: "Room Name already exists in this building -MDB" })
    } else {

      res.status(403).send({ Message: error.message, })
    }
  }
})

// Delete Room data
router.delete('/room/:buildingid/:roomid', verifyToken, async (req, res) => {

  const { buildingid, roomid } = req.params;
  try {
    const remainingGatway = await gatewayModel.countDocuments({ buildingname: buildingid, roomname: roomid })


    if (remainingGatway > 0) {

      return res.status(400).send({ Message: 'Cannot delete Room; remaining Gatways associated' });

    }
    // Proceed with deleting the Room
    const result = await roomModel.deleteOne({
      buildingname: buildingid,
      _id: roomid,

    })


    if (result.deletedCount === 0) {
      return res.status(404).send({ Message: 'No Room found to delete' });
    }

    res.status(200).send({ Message: 'Room deleted successfully' });
  }

  catch (error) {
    res.status(500).send({ Message: 'Failed to delete Room' });
  }

})


// -------------------------------------------------------------------------------------------------
// Gateway Endpoint Start here

// Get Gateway data

router.get('/gateway', async (req, res) => {

  try {
    const response = await gatewayModel.find().populate("buildingname").populate("roomname")
    res.status(200).send(response)
  }
  catch (err) {
    res.status(404).send({ Message: " Failed to find gateway data " })
  }
})

// POST Room Data

router.post('/gateway', verifyToken, async (req, res) => {

  const gaewayInfo = req.body;
  try {

    const existingRoom = await gatewayModel.findOne({ buildingname: gaewayInfo.buildingname, roomname: gaewayInfo.roomname, name: gaewayInfo.name })

    if (!existingRoom) {
      const response = await gatewayModel.create(gaewayInfo)
      res.status(200).send({ Message: "Gateway created successfully" })

    }
    else {

      res.status(409).send({ Message: "Gateway already exists in this building" })
    }

  }

  catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error

      res.status(409).send({ Message: "Gateway already exists in this building -MDB" })
    } else {

      res.status(403).send({ Message: error.message, })
    }
  }

})

// Delete Gateway data
router.delete('/gateway/:buildingid/:roomid/:gatewayid', verifyToken, async (req, res) => {

  const { buildingid, roomid, gatewayid } = req.params;
  try {
    const remainingBooth = await boothModel.countDocuments({ buildingname: buildingid, roomname: roomid, gatewayname: gatewayid })


    if (remainingBooth > 0) {

      return res.status(400).send({ Message: 'Cannot delete Gateway; remaining Booths associated' });

    }
    // Proceed with deleting the Gateway
    const result = await gatewayModel.deleteOne({
      buildingname: buildingid,
      roomname: roomid,
      _id: gatewayid,

    })


    if (result.deletedCount === 0) {
      return res.status(404).send({ Message: 'No Gateway found to delete' });
    }

    res.status(200).send({ Message: 'Gateway deleted successfully' });
  }

  catch (error) {
    res.status(500).send({ Message: 'Failed to delete Gateway' });
  }

})



// Update Gateway Data

router.put('/gateway/:id', verifyToken, async (req, res) => {
  const id = req.params.id
  const gatewayInfo = req.body

  try {
    if (gatewayInfo.buildingname.length > 0 && gatewayInfo.roomname.length > 0 && gatewayInfo.name.length > 0 && gatewayInfo.gatwaymacid.length > 0) {
      const response = await gatewayModel.updateOne({ _id: id }, gatewayInfo)
      res.status(200).send({ Message: "Update successfully" })

    }
    else {

      res.status(403).send({ Message: "Enter All Value" })

    }
  }
  catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error

      res.status(409).send({ Message: "Gateway Name already exists in this building -MDB" })
    } else {

      res.status(403).send({ Message: error.message, })
    }
  }
})

// ------------------------------------------------------------------------------------------------------

// Booth Endpoints


// Get Booth data

router.get('/booth', async (req, res) => {

  try {
    const response = await boothModel.find().populate("buildingname").populate("roomname").populate("gatewayname")
    res.status(200).send(response)
  }
  catch (err) {
    res.status(404).send({ Message: " Failed to find booth data " })
  }
})

// POST Booth Data

router.post('/booth', verifyToken, async (req, res) => {

  const boothInfo = req.body;

  try {

    const existingRoom = await boothModel.findOne({ buildingname: boothInfo.buildingname, roomname: boothInfo.roomname, gatewayname: boothInfo.gatewayname, name: new RegExp("\\b" + boothInfo.name.toString().trim() + "\\b", "i") })

    if (!existingRoom) {
      const response = await boothModel.create(boothInfo)
      res.status(200).send({ Message: "Booth created successfully" })

    }
    else {

      res.status(409).send({ Message: "Booth already exists in this building" })
    }

  }

  catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error

      res.status(409).send({ Message: "Booth already exists in this building -MDB" })
    } else {

      res.status(403).send({ Message: error.message, })
    }
  }

})


// Update Booth Data

router.put('/booth/:id', verifyToken, async (req, res) => {
  const id = req.params.id
  const boothInfo = req.body

  try {
    if (boothInfo.buildingname.length > 0 && boothInfo.roomname.length > 0 && boothInfo.gatewayname.length > 0 && boothInfo.name.length > 0 && boothInfo.sensorid.length > 0 && boothInfo.sensortype.length > 0) {
      const response = await boothModel.updateOne({ _id: id }, boothInfo)

      res.status(200).send({ Message: "Update successfully" })

    }
    else {

      res.status(403).send({ Message: "Enter Value" })

    }
  }
  catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error

      res.status(409).send({ Message: "Booth Name already exists in this building -MDB" })
    } else {

      res.status(403).send({ Message: error.message, })
    }
  }
})




// Delete Booth data
router.delete('/booth/:buildingid/:roomid/:gatewayid/:boothid', verifyToken, async (req, res) => {

  const { buildingid, roomid, gatewayid, boothid } = req.params;


  try {
    const deleteItem = await boothModel.deleteOne({
      buildingname: buildingid,
      roomname: roomid,
      gatewayname: gatewayid,
      _id: boothid

    })

    res.status(200).send({ Message: 'Booth deleted successfully' });
  }
  catch (error) {

    res.status(500).send({ Message: 'Failed to delete Booth' });
  }

})




module.exports = router;