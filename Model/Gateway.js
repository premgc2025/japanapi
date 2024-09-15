
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gatewaySchema = new Schema({
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
  name: {
    type: String,
    required: [true, "Name is mandatory"]
  },
  gatewaymacid: {
    type: Number,
    required: [true, "Gateway Mac Id is mandatory"]
  }
}, { timestamps: true });

// Create a composite unique index
gatewaySchema.index({ name: 1, roomname:1, buildingname: 1 }, { unique: true });

// Create the model
const gatewayModel = mongoose.model('gateways', gatewaySchema);

module.exports = gatewayModel;





