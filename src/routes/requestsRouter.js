const express= require("express");
const {userAuth}=require("../middleware/auth");
const {connectionRequest} = require("../models/connectionRequests");
const User=require("../models/user");

const requestRouter=express.Router();


requestRouter.post("/request/send/:status/:userId",userAuth, async (req,res)=>{
    try{

        let fromUserId=req.user._id
        let toUserId=req.params.userId
        let status=req.params.status
        // console.log(fromUserId,toUserId,status)
        let allowedStatuses=["interested","ignored"]
        if(!allowedStatuses.includes(status)){
            return res.status(404).json({message:"Not a request with valid status"})
        }
        const userExists=await User.findOne({_id:toUserId})
        if(!userExists){
            return res.status(404).json({message:"User doesn't exist, Cannot send connection request"})
        }
        let requestExist=await connectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })
        if(requestExist){
            return res.status(400).json({message:"Request already exists"})
        }
        

        const connectionReq=new connectionRequest({
            fromUserId,
            toUserId,
            status
        })
        await connectionReq.save()
        res.json({message:`connection request send from ${fromUserId} to ${toUserId}`})
    }
    catch(error){
        res.status(404).json({
            message:error.message
        })
    }

})


requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
    try{
        let loggedInUser=req.user
        let {status,requestId}=req.params;
        // console.log(status,requestId)
        let allowedStatus=["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            // console.log(status)
            return res.status(400).json({
                message:"invalid status found"
            })
        }
        // console.log(allowedStatus)
        let requestConnection=await connectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })

        if(!requestConnection){
            return res.status(400).json({
                message:"Connection request not found"
            })
        }
        requestConnection.status=status;
        await requestConnection.save()
        return res.json({
            message:`connection request ${status}`,
            data:requestConnection
        })

    }catch(error){
        res.status(404).json({message:error})
    }
})

module.exports=requestRouter;
