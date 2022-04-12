const express = require("express");
const bodyparser = require("body-parser");
const jwt = require('jsonwebtoken');

const ArticleData = require('../models/article');
const Userdata = require("../models/userData");


//Create Route Handler
const userRouter = express.Router();

userRouter.use(bodyparser.json());
const urlencodedParser = bodyparser.urlencoded({ extended: false });
userRouter.use(urlencodedParser);

let email;
let name;
let role;

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    // console.log(token);
    if (token == "null") {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    // console.log("verifytoken"+payload)
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    email = payload.subject.split(' ')[0]
    role = payload.subject.split(' ')[1]
    name = payload.subject.split(' ')[2]
    console.log("email" + email)
    console.log("role" + role)
    Userdata.findOne({ user_email: email, user_role: role }, (err, doc) => {
        if (!doc) {
            return res.status(401).send('Unauthorized request')
        }
        else {
            next()
        }
    })


}

//fetch all articles for home page
userRouter.get('/', function (req, res) {
    ArticleData.find()
        .then(function (articles) {
            // console.log(articles);
            res.send(articles);
        })
})

//authenticated user to post new article
userRouter.post('/newarticle', verifyToken, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    var item = {
        article_title: req.body.article_title,
        article_author: req.body.article_author,
        article_content: req.body.article_content,
        article_image: req.body.article_image,
        article_category: req.body.article_category
    }
    var article = ArticleData(item);
    console.log("New Article:" + article);
    article.save();
    res.send(article);
})

//authenticated user to update his article
userRouter.put('/update/:id', verifyToken, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const id = req.params.id;
    console.log("ID" + id);
    var item = {
        article_title: req.body.article_title,
        article_author: req.body.article_author,
        article_content: req.body.article_content,
        article_image: req.body.article_image,
        article_category: req.body.article_category
    }
    console.log(email);
    if(role=="admin"){
        ArticleData.findOneAndUpdate({ _id: id }, item, { new: true }, (err, doc) => {
            if (!err) {
                if (!doc) {
                    return res.status(401).send('Unauthorized request')
                }
                else {
                    console.log(doc);
                    res.send(doc);
                }
            }
    
            else {
                console.log(err);
            }
        })
    }
    else{        
        ArticleData.findOneAndUpdate({
            $and: [
                { _id: id },
                { article_author : name }
            ]
        }, item, { new: true }, (err, doc) => {
            if (!err) {
                if (!doc) {
                    return res.status(401).send('Unauthorized request')
                }
                else {
                    console.log(doc);
                    res.send(doc);
                }
            }
    
            else {
                console.log(err);
            }
        })
    }

    // ArticleData.findOneAndUpdate({
    //     $and: [
    //         { _id: id },
    //         { $or: [{ article_author : name }, { user_role: "admin" }] }
    //     ]
    // }, item, { new: true }, (err, doc) => {
    //     if (!err) {
    //         if (!doc) {
    //             return res.status(401).send('Unauthorized request')
    //         }
    //         else {
    //             console.log(doc);
    //             res.send(doc);
    //         }
    //     }

    //     else {
    //         console.log(err);
    //     }
    // })
});

//authenticated user to delete his article
userRouter.delete('/delete/:id', verifyToken, function (req, res) {
    const id = req.params.id;
    console.log("Inside delete" + email);
    ArticleData.findOneAndDelete({ _id: id }, (err, doc) => {
        if (!err) {
            if (!doc) {
                return res.status(401).send('Unauthorized request')
            }
            else {
                console.log("Article deleted" + doc);
                res.send(doc);
            }
        }
        else {
            console.log(err);
        }
    })
})

//fetch articles based on category
userRouter.post('/categorylist', function (req, res) {
    console.log("HI" + req.body.article_category)
    ArticleData.find({ article_category: req.body.article_category })
        .then(function (articles) {
            console.log(articles);
            res.send(articles);
        })
})

//fetch single article
userRouter.get('/getdetails/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access=Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const id = req.params.id;
    ArticleData.find({ _id: id })
        .then(function (articles) {
            console.log("Hai" + articles);
            res.send(articles);
        })
})

module.exports = userRouter;
