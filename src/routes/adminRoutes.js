const express = require("express");
const bodyparser = require("body-parser");
const jwt=require('jsonwebtoken');

const ArticleData = require('../models/article');
const CategoryData = require('../models/category');
const Userdata = require('../models/userData');


//Create Route Handler
const adminRouter = express.Router();

adminRouter.use(bodyparser.json());
const urlencodedParser = bodyparser.urlencoded({extended:false});
adminRouter.use(urlencodedParser);


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
    Userdata.findOne({user_email:email,user_role:'admin'},(err,doc)=>{
        if(!doc){
            console.log('Unauthorized request');
            return res.status(401).send('Unauthorized request')
        }
        else{
            next()
        }
    })
}
//Admin CRUD operation for Category starts........................................................................
adminRouter.get('/categories',function(req,res){
    CategoryData.find()
    .then(function(category){
        console.log(category);
        res.send(category);
    })
})
adminRouter.post('/addcategories',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    var item ={
        category_title         :  req.body.category_title,
    }
    var category = CategoryData(item);
    console.log("New category:"+category);
    category.save()
    .then(data=>{res.send(data)})
    .catch(error=>{res.status(500).send(error)})
})
adminRouter.put('/updatecategory',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    // const id = req.params.id;
    var item ={
        category_title         :  req.body.new_category,
    }
    
    CategoryData.findOneAndUpdate({category_title:req.body.category_title},item,{new: true},(err,doc)=>{
        if(!err){
            console.log(doc);
            ArticleData.updateMany({article_category:req.body.category_title},{$set:{article_category:req.body.new_category}})
            .then((data=>{console.log("category in article updated"+doc)}))
            res.send(doc);
        }
        else{
            console.log(err);
        }
    })
});


adminRouter.post('/deletecategory/:id',verifyToken,function (req,res) {
    const id = req.params.id;
    console.log(req.body.category_title)
    CategoryData.findOneAndDelete({_id:id},(err,doc)=>{
        if(!err){
            console.log("Category deleted"+doc);
            res.send(doc);
        }
        else{
            console.log(err);
        }
    })
})
//Admin CRUD operation for Category ends..........................................................................


//Admin CRUD operation for Article starts........................................................................
adminRouter.get('/',function(req,res){
    ArticleData.find()
    .then(function(articles){
        console.log(articles);
        res.send(articles);
    })
})

adminRouter.post('/newarticle',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    var item ={
            article_title       :  req.body.article_title,
            article_author      :  req.body.article_author,
            article_content     :  req.body.article_content,
            article_image       :  req.body.article_image,
            article_category    :  req.body.article_category
    }
    var article = ArticleData(item);
    console.log("New Article:"+article);
    article.save();
})

adminRouter.put('/update/:id',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const id = req.params.id;
    var item ={
            article_title       :  req.body.article_title,
            article_author      :  req.body.article_author,
            article_content     :  req.body.article_content,
            article_image       :  req.body.article_image,
            article_category    :  req.body.article_category
    }
    ArticleData.findOneAndUpdate({_id:id},item,{new: true},(err,doc)=>{
        if(!err){
            console.log(doc);
        }
        else{
            console.log(err);
        }
    })
});

adminRouter.delete('/delete/:id',verifyToken,function (req,res) {
    const id = req.params.id;
    ArticleData.findOneAndDelete({_id:id},(err,doc)=>{
        if(!err){
            console.log("Article deleted"+doc);
        }
        else{
            console.log(err);
        }
    })
})
//Admin CRUD operation for Article ends..........................................................................


module.exports = adminRouter;
