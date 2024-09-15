

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boothSchema = new Schema({
  buildingname: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"buildings",
    required: [true, "Building Name is mandatory"]
  },
 roomname: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"rooms",
    required: [true, "Room Name is mandatory"]
  },
 gatewayname: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"gateways",
    required: [true, "Gateway Name is mandatory"]
  },
  name: {
    type: String,
    required: [true, "Name is mandatory"]
  },
  sensorid: {
    type: String,
    required: [true, "Sensor Id is mandatory"]
  },
  sensortype: {
    type: String,
    required: [true, "Sensor Type is mandatory"]
  }
}, { timestamps: true });

// Create a composite unique index
boothSchema.index({ name: 1, gatewayname:1, roomname:1, buildingname: 1 }, { unique: true });

// Create the model
const boothModel = mongoose.model('booths', boothSchema);

module.exports = boothModel;





