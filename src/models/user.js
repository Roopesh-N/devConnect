const mongoose=require("mongoose")
const validator=require("validator")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:20,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:20,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,

    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        require:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("wrong gender provided")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid URL")
            }
        },
    },
    about:{
        type:String,
    },
    skills:{
        type:[String],
        validate(value){
            if(value.length>5){
                throw new Error("Maximum of 5 skills can be added")
            }
        }
    }
},
{ timestamps: true }
)

userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"Dev@Connect",{expiresIn:"1d"})
    return token;
}

userSchema.methods.validatePassword=async function(userInputPassword){
    const user=this;
    const hashedpwd=user.password;
    let isValidPassword= await bcrypt.compare(userInputPassword,hashedpwd);
    return isValidPassword;
}

const User= mongoose.model("User",userSchema);

module.exports=User;