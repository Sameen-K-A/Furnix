const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    startDate : {
        type : String,
    },
    endDate : {
        type : String,
    },
    coupencode : {
        type : String
    },
    minBuyRate : {
        type : Number
    },
    maxBuyRate : {
        type : Number
    },
    availableUsers : {
        type : Array
    },
    redeemedUsers : {
        type : Array
    },
    discountPercentage : {
        type : Number
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    couponStatus : {
        type : String,
        required : true
    }
},{
    versionKey : false
})
const Coupon = mongoose.model("Coupons" , couponSchema);
module.exports = Coupon