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
        type : String
    },
    OfferEndDate : {
        type : String
    },
    OfferDiscount : {
        type : Number
    },
    OfferStartingPrice : {
        type : Number
    },
    createDate : {
        type : String
    }
},{
    versionKey : false
});

const Category = mongoose.model('category' , catSchema);
module.exports = Category;