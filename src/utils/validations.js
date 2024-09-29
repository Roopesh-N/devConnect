
const validator=require("validator");
const User=require("../models/user")

const validateSignUp=function(req){
    const {firstName,lastName,email,password}=req.body;
    // console.log(password)
    if(!firstName || !lastName){
        throw new Error("Enter valid name")
    }
    else if(!validatePassword(req)){
        throw new Error("Enter strong password")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Enter valid Email")
    }
    // else if(userExists(email)){
    //     throw new Error("User with this email already exists")
    // }
    // console.log("no issue here at validations")
}

const validatePassword=function(req){
    const {password}=req.body;
    if(!validator.isStrongPassword(password)){
        return false
    }
    return true
}

const userExists= async function(emailId){
    const user=await User.findOne({email:emailId})
    // console.log(user)
    if(user){
        return true
    }
    else{
        return false
    }
}

const validateLogin=function(req){
    const {email}=req.body;
    if(!validator.isEmail(email)){
        throw new Error("Enter valid Email")
    }
}

const  validateProfileEdit=function(req){
    const allowedFields=["firstName","lastName","age","gender","skills","about","photoUrl"]
    const isAllowed=Object.keys(req.body).every((k)=>allowedFields.includes(k))
    return isAllowed;

}
module.exports={validateSignUp,validateLogin,validateProfileEdit, validatePassword}