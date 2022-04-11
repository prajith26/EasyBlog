const express = require("express");
const bodyparser = require("body-parser");
const jwt=require('jsonwebtoken');

const ArticleData = require('../models/article');
const Userdata = require('../models/userData');

//Create Route Handler
const rootRouter = express.Router();

rootRouter.use(bodyparser.json());
const urlencodedParser = bodyparser.urlencoded({extended:false});
rootRouter.use(urlencodedParser);


function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    // console.log(token);
    if(token=="null"){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token,'secretKey')
    // console.log("verifytoken"+payload)
    if(!payload)
    {
        return res.status(401).send('Unauthorized request')
    }
    let email = payload.subject.split(' ')[0]
    let role = payload.subject.split(' ')[1]
    console.log("email" + email)
    console.log("role" + role)
    Userdata.findOne({user_email:email,user_role:'root'},(err,doc)=>{
        if(!doc){
            return res.status(401).send('Unauthorized request')
        }
        else{
            next()
        }
    })
}
rootRouter.get('/getlist',verifyToken,function(req,res){
    Userdata.find({$or:[{user_role:"admin"},{user_role:"user"}]})
    .then(function(users){
        console.log(users);
        res.send(users);
    })
})

rootRouter.post('/promote',verifyToken,function(req,res){
    Userdata.findOneAndUpdate({_id:req.body._id},{$set:{user_role:"admin"}},{new:true})
    .then(function(users){
        console.log(users);
        res.send(users);
    })
})

rootRouter.post('/demote',verifyToken,function(req,res){
    Userdata.findOneAndUpdate({_id:req.body._id},{$set:{user_role:"user"}},{new:true})
    .then(function(users){
        console.log(users);
        res.send(users);
    })
})

module.exports = rootRouter;
