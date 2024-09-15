// Middleware
const express = require('express')
const jwt = require('jsonwebtoken')

function verifyToken(req,res,next){

    const header =  req.headers.header
    console.log("token Verify", req.headers.header.split(" ")[1])

   
    if(header!==undefined){
       
        const token =  req.headers.header.split(" ")[1]
        if(token!==null){
            jwt.verify(token, "mypassword",(err,result)=>{
                if(!err)
                {
                    next()
                }
                else{
                    res.status(403).send({Message:"Ivalid token"})
                }
            })
        }
        else{
            res.status(403).send({Message:"Send token"})
        }
    }
    else{
        res.status(403).send({Message:"Send  token to access"})
    }
   

}

module.exports = verifyToken;
