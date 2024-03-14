const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    categoryName : {
        type : String,
        required : true
    },
    categoryID : {
        type : String,
        required : true
    },
    regularPrice : {
        type : Number,
        required : true
    },
    offerPercentage : {
        type : Number,
    },
    offerPrice : {
        type : Number
    },
    capacity : {
        type : Number,
        required : true
    },
    material : {
        type : String,
        required : true
    },
    stock : {
        type : Number,
        required : true
    },
    color : {
        type : String,
        required : true
    },
    images : {
        type : Array,
        required : true
    },
    isBlocked : {
        type : Boolean,
        default : false,
    },
    cartQty : {
        type : Number
    },
    avgStar : {
        type : Number,
        default : 0
    },
}, {
    versionKey : false
});


const Product = mongoose.model("product" , productSchema);
module.exports = Product;