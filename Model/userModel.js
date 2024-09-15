
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,"Name is mandatory"]
    },
    password:{
        type:String,
        required:[true,"Name is mandatory"]
    },
    age:{
        type:Number,
        required:[true,"Name is mandatory"]
    }
},{timestamps:true})

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;