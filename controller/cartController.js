const User = require("../model/userModel");
const Product = require("../model/productModel");

//========================================= Cart page rendering ==============================================

const cartpage = async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.session.user });
        const productData = await Product.find({});
        const ProductResultarray = [];
        const userCartArray = [];
        if (userData) {
            for (let i = 0; i < userData.cart.length; i++) {
                const cartproductIdString = userData.cart[i].productID.toString();
                userCartArray.push(cartproductIdString)
                for (let j = 0; j < productData.length; j++) {
                    const productIdString = productData[j]._id.toString();
                    if (cartproductIdString === productIdString) {
                        ProductResultarray.push(productData[j]);
                        break;
                    }
                }
            }
        }
        const userCartproducts = ProductResultarray;
        res.render("user/cart", { userData, userCartproducts })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Cart page rendering ==============================================

const cartpagepost = async (req, res) => {
    try {
        const productID = req.body.id;
        const product = await Product.findOne({ _id: productID });
        const obj = {
            productID: product._id
        }
        if (req.session.user) {
            const updateProcess = await User.updateOne({ email: req.session.user }, { $push: { cart: obj } , $inc : {total : product.regularPrice}});
            res.json({ status: "okay" })
        } else {
            res.json({ status: "notlogin" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Cart page rendering ==============================================

const deleteproduct = async (req, res) => {
    try {
        const deleteID = req.body.id;
        const price = parseInt(req.body.price);
        const quantity = parseInt( req.body.qtynumber);
        const updateTotal = price * quantity;
        const user = await User.findOne({email : req.session.user});
        const usercart = await User.updateOne({ email: req.session.user }, { $pull: { cart: { productID: deleteID } } });
        if (usercart.modifiedCount === 1) {
            user.total -= updateTotal;
            user.save()
            res.json({ status: "okay"})
        } else {
            res.json({ status: "wrong" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Cart product quantity increment ==============================================

const cartPlus = async (req, res) => {
    try {
        const bodyproductID = req.body.id;
        const productIndex = req.body.index;
        const priceString = req.body.price;
        const price = parseInt(priceString)
        const qtynumber = req.body.qtynumber;

        const fetchingUser = await User.findOne({ email: req.session.user });
        let fetchingProducts;
        if (fetchingUser) {
            fetchingProducts = await Product.findOne({ _id: fetchingUser.cart[productIndex].productID })
        }
        if (fetchingProducts.stock >= qtynumber) {
            if (qtynumber <= 10) {
                fetchingUser.cart[productIndex].qty = qtynumber;
                fetchingUser.total += price;
                fetchingUser.save()
                res.json({ status: "okay" , total : fetchingUser.total})
            } else {
                res.json({ status: "limitReached" })
            }
        } else {
            res.json({ status: "stocknotavailable" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Cart product quantity decrement ==============================================

const cartMinus = async (req, res) => {
    try {
        const productID = req.body.id;
        const productIndex = req.body.index;
        const priceString = req.body.price;
        const price = parseInt(priceString)
        const qtynumber = req.body.qtynumber;
        if (qtynumber >= 1) {
            const fetchingUser = await User.findOne({ email: req.session.user })
            fetchingUser.cart[productIndex].qty = qtynumber;
            fetchingUser.total -= price
            fetchingUser.save()
            res.json({ status: "okay" , total : fetchingUser.total})
        } else {
            res.json({ status: "minimum1" })
        }

    } catch (error) {
        console.log(error);
    }
}

//========================================= Export all modules ==============================================

module.exports = {
    cartpage,
    cartpagepost,
    deleteproduct,
    cartPlus,
    cartMinus
}