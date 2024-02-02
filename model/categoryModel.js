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
    }
},{
    versionKey : false
});

const Category = mongoose.model('category' , catSchema);
module.exports = Category;