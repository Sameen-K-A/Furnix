const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "userdatas",
        required : true
    },
    walletAmount : {
        type : Number,
        default : 0
    },
    transactions : [{
        transactionID : {
            type : String,
        },
        amount : {
            type : Number
        },
        date : {
            type : String
        },
        status : {
            type : String,
        }
    }]
},{
    versionKey : false,
});

const Wallet = mongoose.model("Wallet" , walletSchema);
module.exports = Wallet;