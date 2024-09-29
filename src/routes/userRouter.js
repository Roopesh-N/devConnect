const express=require("express");
const {userAuth}=require("../middleware/auth")
const userRouter=express.Router();
const {connectionRequest} = require("../models/connectionRequests");
const User = require("../models/user");


let SAFE_FIELDS="firstName lastName  age skills gender about photoUrl"


userRouter.get("/user/requests/received",userAuth, async (req,res)=>{
    try{
        let loggedInuser=req.user;
        const connectionRequests=await connectionRequest.find({
            toUserId:loggedInuser._id,
            status:"interested"
        }).populate("fromUserId",SAFE_FIELDS)
        // console.log(connectionRequests)
        res.json({
            message:"ConnectionRequests",
            data:connectionRequests
        })

    }catch(error){
        res.status(404).json({message:"Invalid request"})
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        let loggedInUser=req.user;
        let connections=await connectionRequest.find({
                $or:[
                {fromUserId:loggedInUser._id, status:"accepted"},
                {toUserId:loggedInUser._id, status:"accepted"}
                ]
            }).populate("fromUserId",SAFE_FIELDS).populate("toUserId",SAFE_FIELDS)



        let data=connections.map((each)=>{
            if(loggedInUser._id.toString()===each.fromUserId._id.toString()){
                return each.toUserId;
            }
            // console.log(each.fromUserId.firstName)
            return each.fromUserId;
        }
    );
        
        res.json({data})
    }catch(error){
        res.status(404).json({
            message:error
        })
    }
})
userRouter.get("/feed", userAuth, async (req,res)=>{

    try{
        let loggedInUser=req.user;
        
        let page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) ||10;
        limit=limit>50?50:limit;
        let skip=(page-1)*limit
        let connections=await connectionRequest.find({
            $or:[{fromUserId:loggedInUser._id },{toUserId:loggedInUser._id}]
        }).select("fromUserId toUserId");

        let hideProfiles=new Set();
        hideProfiles.add(loggedInUser._id.toString())
        connections.forEach((conn)=>{
            hideProfiles.add(conn.fromUserId.toString())
            hideProfiles.add(conn.toUserId.toString())
        })
        let data= await User.find({
            _id:{$nin:Array.from(hideProfiles)}
        }).select(SAFE_FIELDS).skip(skip).limit(limit)

        res.json({
            data
        })
    }catch(error){
        res.status(404).json({message:error})
    }
})


module.exports=userRouter;
