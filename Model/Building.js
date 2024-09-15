
const mongoose = require('mongoose')


const buildingSchema = mongoose.Schema({

    name:{
        type:String,
        required:[true,"Name is mandatory"],
        unique:true
    },

    address:{
        type:String,
        required:[true,"Address is mandatory"]
    }

},{timestamps:true})

const buildingModel = mongoose.model("buildings",buildingSchema);

module.exports = buildingModel;