var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
   title: {type:String, required:true, index:{unique:true}},
   author: {type:String, required:true,index:{unique:true}},
   subject: {type:String,required:true},
   location: String,
   totalCopies: Number,
   availableCopies:Number,
   checked:Boolean,
   hiredCopies: [{
       username:{type: String,default:"user"},
       returnDate:{type: Date, default: Date.now}
       
   }],
   hireBookDetails: {type:String,default:"none"},
   body:{type:String}
  
   

});

module.exports = mongoose.model('Book',BookSchema);

