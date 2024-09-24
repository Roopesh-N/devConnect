const express =require("express");
const {validateSignUp,validateLogin}=require("../utils/validations")
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const User=require("../models/user")


const authRouter=express.Router();

authRouter.post("/signup",async (req,res)=>{
    try{
        // validate data for signup
        validateSignUp(req)

        const {firstName,lastName,password,email}=req.body;
        // generate encrypted password
        const hashedpwd=await bcrypt.hash(password,10);
        
        const user=new User({
            firstName,
            lastName,
            email,
            password:hashedpwd
        })
        await user.save()
        res.send("user added successfully")
    }
    catch(err){
        res.status(400).send("user data not added "+err)
    }
})



authRouter.post("/login",async (req,res)=>{
    try{
        const {email,password}=req.body;
        validateLogin(req)
        const user=await User.findOne({
            email:email
        })
        if(!user){
            throw new Error("Invalid credentials")
        }

        let isValidPassword= await user.validatePassword(password)
        if(isValidPassword){
            const token=await user.getJWT()
            res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)})
            res.send("login successfull")
        }else{
            throw new Error("Invalid credentials")
        }

    }
    catch(error){
        res.status(400).send("Login Faild " + error)
    }
})

authRouter.post("/logout",async (req,res)=>{
    res.cookie("token", null, {expires:new Date(Date.now())});
    res.send("logout successfull")
})




module.exports=authRouter;