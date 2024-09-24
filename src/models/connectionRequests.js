const mongoose=require("mongoose")


const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:{
            values:["accepted","rejected", "ignored", "interested"],
            message:`{VALUE} invalid status Type`
        }
    }
},{
    timestamps:true
})

connectionRequestSchema.index({
    fromUserId:1, toUserId:1
})

connectionRequestSchema.pre("save",function(){
    let connectionRequest=this
    // check if from userID is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself")
    }
})

const connectionRequest=mongoose.model("connectionRequest",connectionRequestSchema)
module.exports={connectionRequest};