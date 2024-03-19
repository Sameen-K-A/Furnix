const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    message : {
        type : String
    },
    date : {
        type : String
    },
    reply : {
        type : String,
        default : "No reply"
    }
},{
    versionKey : false
});

const Contact = mongoose.model("Contact" , contactSchema);
module.exports = Contact;