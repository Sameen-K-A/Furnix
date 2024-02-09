const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config();
const mongo = mongoose.connect(process.env.mongoDB);
mongo.then(()=>{
    console.log("mongoDB connected");
})
.catch((err)=>{
    console.log("MongoDB is not connected" , err);
})