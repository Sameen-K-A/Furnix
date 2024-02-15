const User = require("../model/userModel");
const Product = require("../model/productModel");

//========================================= Cart page rendering ==============================================

const cartpage = async (req , res) => {
    try {
        const userData = await User.findOne({email : req.session.user});
        const productData = await Product.find({});
        const array = [];
        if(userData){
            for( let i=0 ; i< userData.cart.length ; i++){
                const cartproductIdString = userData.cart[i].productID.toString()
                for( let j=0 ; j<productData.length ; j++) {
                    const productIdString = productData[j]._id.toString();
                    if(cartproductIdString === productIdString){
                        array.push(productData[i]._id)
                    }
                }
            }
        }
        const userCartproducts = await Product.find({_id : {$in : array}})
        res.render("user/cart" , {userData , userCartproducts})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Cart page rendering ==============================================

const cartpagepost = async (req , res) => {
    try {
        const productID = req.body.id;
        const product = await Product.findOne({_id : productID});
        const obj = {
            productID : product._id
        }
        if(req.session.user){
            const updateProcess = await User.updateOne({email : req.session.user} , {$push : {cart : obj}})
            res.json({status : "okay"})
        } else {
            res.json({status : "notlogin"})
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