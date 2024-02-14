const User = require("../model/userModel");
const Product = require("../model/productModel");

//========================================= Cart page rendering ==============================================

const cartpage = async (req , res) => {
    try {
        const userData = await User.findOne({email : req.session.user});
        res.render("user/cart" , {userData})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Cart page rendering ==============================================

const cartpagepost = async (req , res) => {
    try {
        const productID = req.body.id;
        if(productID){
            res.json({status : "okay"})
        } else {
            res.json({status : "wrong"})
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Export all modules ==============================================

module.exports = {
    cartpage,
    cartpagepost
}