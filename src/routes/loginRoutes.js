const express = require("express");
const bodyparser = require("body-parser");
const jwt =require('jsonwebtoken');

//access Userdata Schema
const Userdata = require('../models/userData');

//create route handler
const loginRouter = express.Router();

loginRouter.use(bodyparser.json());
const urlencodedParser = bodyparser.urlencoded({ extended: false });
loginRouter.use(urlencodedParser);


loginRouter.post('/',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
   
    Userdata.findOne({user_email:req.body.email},(err,user)=>{
        if(err){
            console.log(err);
            res.status(401).send(err);
        }
        //Check for New User
        if(!user){
            // console.log(req.body.email)
            console.log("Not a registerd user.Please register first");
            res.status(401).send({message:'Not a registerd user.Please register first'})
            // res.json({success:false, message: }); 
        }
        //Already a registerd User
        else{
            //Checking if pwd match email ID
            if(user.user_password != req.body.password){
                console.log("Entered password does not match with the registerd Email ID");
                res.status(401).send({message:"Entered password does not match with the registerd Email ID"})
                // res.json({success:false, message: ''}); 
            }
            else{
                //Generate token for user and send res back
                //token generation
                console.log(req.body.email)
                let payload = {subject:req.body.email+" "+user.user_role+" "+user.user_name}
                let token = jwt.sign(payload,'secretKey')
                if (user.user_role == "admin"){
                    console.log("Admin Logged in");
                    res.status(200).send({message: 'Admin Logged In',token,user})
                // res.json({success:true, message: 'Admin Logged In',token}); 
                }
                else if(user.user_role == "root"){
                    console.log("Root user Logged in");
                    res.status(200).send({message: 'Root user Logged In',token,user})
                // res.json({success:true, message: 'User Logged In'}); 
                }
                else{
                    console.log("User Logged in");
                    res.status(200).send({message: 'User Logged In',token,user})
                // res.json({success:true, message: 'User Logged In'}); 
                }
            }
            
        }
    });
});
module.exports = loginRouter;