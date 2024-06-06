const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    pic:{type:String,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
},{timestamp:true})


//creating a method to match password of the user when he is logging in
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//before saving the user what we want to do is encrypt the password so thats what we are doing here using bcryptjs
//this pre-save hook is designed to automatically hash the user's password before saving it to the database, 
//but only if the password field (this.Password) has been modified. If no modifications to the password have been made 
//(e.g., during an update that doesn't involve the password field), the hook will simply move to the next step without rehashing the password. 
userSchema.pre("save", async function (next) {  
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User=mongoose.model("User",userSchema);

module.exports=User;