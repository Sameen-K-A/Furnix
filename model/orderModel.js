const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    product: {
        type: Array,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    orderID: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time : {
        type : String,
        required: true
    },
    status: {
        type: String,
        default: "Ordered"
    },
    total: {
        type: Number,
        required: true
    },
    itemsCount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    deliveredDateTime : {
        type : String,
        default : false
    },
    subTotal : {
        type : Number
    },
    couponOffer : {
        type : Number,
        default : 0
    },
    couponCode : {
        type : String,
        default : false
    },
    deliveryCharge : {
        type : Number,
        default : 100
    }
},{
    versionKey: false
})

const Order = mongoose.model('Order', productSchema);
module.exports = Order;