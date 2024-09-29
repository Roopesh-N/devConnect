const express=require("express");
const {userAuth}=require("./middleware/auth")
const {connectDB}=require("./config/database")
const cookieParser=require("cookie-parser")
const cors=require("cors")

const authRouter=require("./routes/authRouter")
const profileRouter=require("./routes/profileRouter")
const requestsRouter=require("./routes/requestsRouter")
const userRouter=require("./routes/userRouter")



const app=express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}
))
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestsRouter)
app.use("/",userRouter)










connectDB().then(()=>{
    console.log("database conneection successfull")
    app.listen(5555,()=>{
        console.log("Server is running on PORT 5555")
    })
})
.catch((err)=>{
    console.log("db connection failed", err)
})
