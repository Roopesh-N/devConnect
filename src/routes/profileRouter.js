const express=require("express");
const {userAuth}=require("../middleware/auth")
const bcrypt=require("bcrypt")
const {validateProfileEdit,validatePassword}=require("../utils/validations")

const profileRouter=express.Router();

// to view user profile
profileRouter.get("/profile/view",userAuth, async (req,res)=>{
    try{
        const user=req.user
        res.send(user)
    }catch(err){
        res.status(404).send("invalid action")
    }
})

// to edit user profile
profileRouter.get("/profile/edit",userAuth,async (req,res)=>{
    try{
        // validate the update data
        if(!validateProfileEdit(req)){
            throw new Error("Couldn't update the use data")
        }
        let loggedInUser=req.user;
        Object.keys(req.body).every((key)=>loggedInUser[key]=req.body[key])
        await loggedInUser.save()
        res.send(`User ${loggedInUser.firstName} : Updated successfully`)
    }catch(error){
        res.status(404).send("User data not updated")
    }
})

// update password api
profileRouter.patch("/profile/password", userAuth ,async (req,res)=>{

    try{
        let {password}=req.body
        if(!validatePassword(req)){
            throw new Error("provide a strong password")
        }
        let loggedInUser=req.user;
        const hashedpwd=await bcrypt.hash(password,10);
        console.log(hashedpwd)
        loggedInUser.password=hashedpwd;
        await loggedInUser.save()
        console.log(loggedInUser)
        res.send(`User ${loggedInUser.firstName} : password Updated successfully`)

    }catch(error){
        res.status(404).send("Error:"+error.message)
    }
})


module.exports=profileRouter;