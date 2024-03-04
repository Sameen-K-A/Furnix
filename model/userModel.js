const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    referCode : {
        type : String,
        required : true
    },
    address: [{
        name: {
            type: String
        },
        number: {
            type: Number
        },
        address: {
            type: String
        },
        pin: {
            type: Number
        },
        district: {
            type: String
        },
        state: {
            type: String
        },
        addressType: {
            type: String
        },
        landmark: {
            type: String
        },
        alternateNumber: {
            type: Number
        },
    }],
    cart: [{
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        qty: {
            type: Number,
            default: 1
        }
    }],
    total : {
    type: Number,
    default: 0
}
}, {
    versionKey: false
})


const User = mongoose.model('UserData', userSchema);
module.exports = User;