const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
    productID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "products",
        required : true,
    },
    email : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    }
},{
    versionKey : false
})

const Wishlist = mongoose.model("Wishlistdatas" , wishlistSchema);
module.exports = Wishlist;