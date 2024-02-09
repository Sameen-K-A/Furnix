const User = require("../model/userModel");
const Product = require("../model/productModel");

// When admin is login
const isAdmin = (req, res, next) => {
    try {
        if (req.session.admin) {
            next();
        } else {
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error);
    }
}



// blocked user
const isBlocked = async (req , res , next) => {
    try {
        if(req.session.user) {
            const checkBlock = await User.findOne({email : req.session.user});
            if(checkBlock.isBlocked === true){
                delete req.session.user;
                res.render("user/userLogin" , {message : "Admin blocked your account"})
            }else{
                next();
            }
        }else{
            next()
        }
    } catch (error) {
        console.log(error);
    }
}


// user not logged
const isNoUser = (req , res , next) => {
    try {
        if(!req.session.user){
            next()
        }else{
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
}


// if admin blocked a product 
const isProductBlocked = async (req , res , next) => {
    try {
        const proId = req.query.id;
        const checkProBlock = await Product.findOne({_id : proId})
        if(checkProBlock.isBlocked === true){
            res.redirect("/")
        }else{
           next() 
        }
    } catch (error) {
        
    }
}



module.exports = {
    isAdmin,
    isBlocked,
    isNoUser,
    isProductBlocked
};