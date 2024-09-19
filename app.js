const express=require("express");

const app=express();

app.use("",(req,res)=>{
    res.send("Hey there!!")
})


app.listen(5555,()=>{
    console.log("Server is running on PORT 5555")
})