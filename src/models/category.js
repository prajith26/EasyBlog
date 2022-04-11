//Access mongoose package
const mongoose = require("mongoose");

//Schema definition
const Schema = mongoose.Schema;
 
//Define structure of Articledata collection using Schema constructor
const CategorySchema = new Schema({
            category_title       : { type : String , required : true  },
            category_createdon   : { type : Date   , default: Date.now },   //Category Created Date
});

//Create model Categorydata
var Categorydata = mongoose.model('Categorydata',CategorySchema);

//exports
module.exports = Categorydata ;

