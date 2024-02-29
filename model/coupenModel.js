const mongoose = require("mongoose");
const dateGenerator = require("../config/dateGenerator")
const couponSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    startDate : {
        type : String,
        default : dateGenerator()
    },
    endDate : {
        type : String,
        default : "No expairy date"
    },
    coupencode : {
        type : String
    },
    minBuyRate : {
        type : Number
    },
    discountAmound : {
        type : Number
    },
})
const Coupon = mongoose.model("Coupons" , couponSchema);
module.exports = Coupon