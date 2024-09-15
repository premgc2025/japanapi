
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  buildingname: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"buildings",
    required: [true, "Building Name is mandatory"]
  },
  name: {
    type: String,
    required: [true, "Name is mandatory"]
  },
  floor: {
    type: Number,
    required: [true, "Floor is mandatory"]
  }
}, { timestamps: true });

// Create a composite unique index
roomSchema.index({ name: 1, buildingname: 1 }, { unique: true });

// Create the model
const roomModel = mongoose.model('rooms', roomSchema);

module.exports = roomModel;





