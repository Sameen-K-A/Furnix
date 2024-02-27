const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "userdatas",
        required : true
    },
    products : [{
        productID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "products",
            required : true
        },
        date : {
            type : String,
            required : true
        }
    }]
},{
    versionKey : false
})

const Wishlist = mongoose.model("Wishlistdatas" , wishlistSchema);
module.exports = Wishlist;