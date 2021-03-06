var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema ({
    username:{type:String , required:true, index:{unique:true}},
    email:{type:String , required:true, index:{unique:true}},
    password:{type:String, required:true},
    admin:Boolean,
    bookHiringHistory: [{title:String,author:String,returnDate:Date,body:String,
                         status:{type:String,default:"Issued"},penalty:{type:Number, default:0}}]
    
});
// password hashing
//    
//    UserSchema.pre('save',function(next){
//        var user = this; 
//        if(!user.isModified('password')) return next();
//            bcrypt.hash(user.password,null,null, function(err,hash){
//                if(err)return next(err);
//                user.password =hash;
//                next();
//        });
//    
//});
//    // creating custom method
    // this method compares password that user typed in with what we have in db
//    
//    UserSchema.methods.comparePassword = function(password){
//        
//        var user = this;
//        console.log(bcrypt.compareSync(password,user.password))
//      
//        
//    };

module.exports = mongoose.model('User',UserSchema);
    