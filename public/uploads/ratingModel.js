const mongoose = require("mongoose");
const ratingSchema = new mongoose.Schema({

    productID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "products",
        required : true
    },
    name : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    star : {
        type : Number,
        default : 1
    }
})

const Rating = mongoose.model("Rating" , ratingSchema);
module.exports = Rating