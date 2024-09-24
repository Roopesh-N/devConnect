const mongoose=require("mongoose");

const connectDB=async ()=>{
    await mongoose.connect("mongodb+srv://nagineniroopesh143:Z5o288P1oNZ9hgFW@cluster0.1ucpj.mongodb.net/devConnect")
}

module.exports={connectDB}