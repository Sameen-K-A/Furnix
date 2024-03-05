const mongoose = require("mongoose");
const catSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    OfferStartDate : {      // offer side
        type : String,
        default : "false"
    },
    OfferEndDate : {
        type : String,
        default : "false"
    },
    OfferDiscount : {
        type : Number,
        default : 0
    },
    OfferStartingPrice : {
        type : Number,
        default : 0
    },
    catOfferStatus : {
        type : String,
        default : "false"
    },
    createDate : {
        type : String,
        default : "false"
    }   
},{
    versionKey : false
});

const Category = mongoose.model('category' , catSchema);
module.exports = Category;