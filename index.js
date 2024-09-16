

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
require('dotenv').config();
const PORT = process.env.PORT ||5000;
// const router = express.Router()




// app.use(express.json())
app.use(bodyParser.json())
app.use(cors())



const mongoURL = process.env.mongoURL

// importing Model
const buildingModel = require('./Model/Building')
const roomModel = require('./Model/Room')
const userModel = require('./Model/userModel')
const uRoutes = require('./Router/uRoutes')
const verifyToken = require('./VerifyToken')

app.use('/', uRoutes)

// MongoDB Connection
mongoose.connect(`${mongoURL}/BMS`)
    .then((response) => {
        console.log("DBMS is Up and Running")
    })

    .catch((err) => {
        console.log(err)
    })


// Get Building data

app.get('/building', async (req, res) => {

    try {
        const response = await buildingModel.find()
        res.status(200).send(response)
    }
    catch (err) {
        res.status(404).send({ Message: " Failed to find data-MDB " })
    }
})


// Get Single Building Data

app.get('/building/:id', async (req, res) => {
    const id = req.params.id
    try {
        const response = await buildingModel.findOne({ _id: id })
        if (response !== null) {
            res.status(200).send(response)
        }
        else {
            res.status(404).send({ Message: " Failed to get data " })
        }
    }
    catch (err) {
        res.status(404).send({ Message: " Failed to find data " })
    }
})

// POST Building Data

app.post('/building', async (req, res) => {

    const buildingInfo = req.body;
   
    try {
        const response = await buildingModel.create(buildingInfo)
        res.status(200).send({ Message: "Building created successfully" })
    } 
    catch (error) {
        if (error.code === 11000) {
          // Handle duplicate key error
        
          res.status(409).send({ Message: "Building already exists -MDB" })
        } else {
         
          res.status(403).send({ Message:error.message, })
        }
      }
})


// Update Building Data

app.put('/building/:id', async (req, res) => {
    const id = req.params.id
    const buildingIfo = req.body
    try {
        if(buildingIfo.name.length>0 && buildingIfo.address.length>0 ){
            const response = await buildingModel.updateOne({ _id: id }, buildingIfo)
           
            res.status(200).send({ Message: "Update successfully" })

        }
        else{
         
            res.status(403).send({ Message:"Enter Value" })

        }
       

    }
    catch (error) {
        if (error.code === 11000) {
          // Handle duplicate key error
         
          res.status(409).send({ Message: "Building Name already exists -MDB" })
        } else {
       
          res.status(403).send({ Message:error.message, })
        }
      }
})




// --------------------------------------------------------------------------
// User Registration

app.post('/register', (req, res) => {

    const registerData = req.body;

    bcrypt.genSalt(saltRounds = 10, (err, salt) => {
        if (!err) {

            bcrypt.hash(registerData.password, salt, async (err, hash) => {
                if (!err) {
                    registerData.password = hash
                    try {
                        const data = await userModel.create(registerData)

                        res.status(200).send({ Message: "User created successfully" })
                    }
                    catch (err) {
                        res.status(500).send(err)
                    }
                }
                else {
                    res.send({ Message: "Some error while hashing passwword" })
                }
            })
        }
        else {
            res.send({ Message: "Some error while bcrypt passwword" })
        } })
})

// --------------------------------------------------------------------------
// User Registration

app.post('/login', async(req, res) => {

    const loginData = req.body;


   
                    try {
                        const data = await userModel.findOne({email:loginData.email})
                       
                        if(data!==null)
                        {
                            bcrypt.compare(loginData.password, data.password,(err,success)=>{
                                if(success==true){
                                   

                                    jwt.sign(loginData.email, "mypassword",(err,token)=>{
                                        if(!err)
                                        {
                                            
                                            res.status(200).send({Message:"Login succesfull", token:token, id:data._id})
                                        }
                                    })
                                   

                                }
                                else{
                                    res.status(401).send({ Message: "Wrong password" })

                                }
                            })
                        }
                        else{
                            res.status(401).send({ Message: "Wrong Email" })

                        }

                      
                    }
                    catch (err) {
                        res.status(500).send(err)
                    }
                })



// -----------------------------------------------------------------------------

// Server Connection


app.listen(PORT, () => {
    console.log("Server Up and Running at PORT :", PORT)
})