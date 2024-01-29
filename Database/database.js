const mongoose = require("mongoose");
const mongo = mongoose.connect("mongodb://localhost:27017/FURNIX");
mongo.then(()=>{
    console.log("mongoDB connected");
})
.catch((err)=>{
    console.log("MongoDB is not connected" , err);
})