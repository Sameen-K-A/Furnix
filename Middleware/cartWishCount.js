const Wishlist = require("../model/wishlistModel");
const User = require("../model/userModel");
const countFunction = async (req,res,next) => {
    if(req.session.user){
        const user = await User.findOne({email : req.session.user});
        req.session.CartCount = user.cart.length;
        const wish = await Wishlist.findOne({userID : user._id});
        if(wish){
            req.session.wishCount = wish.products.length;
        }
        next()
    } else{
        next()
    }
};

module.exports = countFunction;