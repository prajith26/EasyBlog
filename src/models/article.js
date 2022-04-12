//Access mongoose package
const mongoose = require("mongoose");

//Schema definition
const Schema = mongoose.Schema;
 
//Define structure of Articledata collection using Schema constructor
const ArticleSchema = new Schema({
            article_title       : { type : String , required : true  },
            article_createdon   : { type : Date   , default: Date.now },   //Article Created Date
            article_author      : { type : String , required : true  },
            article_category    : { type : String , required : true  },
            article_content     : { type : String , required : true  },
            article_image       : { type : String }
});

//Create model Articledata
var Articledata = mongoose.model('Articledata',ArticleSchema);

//exports
module.exports = Articledata ;

