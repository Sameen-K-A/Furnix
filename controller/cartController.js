const User = require("../model/userModel");
const Product = require("../model/productModel");
const Order = require("../model/orderModel")
const dateGenerator = require("../config/dateGenerator");
const idGenerator = require("../config/randomID");

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
                        if (productData[j].stock === 0) {
                            userData.total -= userData.cart[i].qty * productData[j].regularPrice;
                            userData.cart[i].qty = 0;
                        }
                        break;
                    }
                }
            }
            userData.save()
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
            await User.updateOne({ email: req.session.user }, { $push: { cart: obj }, $inc: { total: product.regularPrice } });
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
        const quantity = parseInt(req.body.qtynumber);
        const updateTotal = price * quantity;
        const user = await User.findOne({ email: req.session.user });
        const usercart = await User.updateOne({ email: req.session.user }, { $pull: { cart: { productID: deleteID } } });
        if (usercart.modifiedCount === 1) {
            user.total -= updateTotal;
            user.save()
            res.json({ status: "okay" })
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
                res.json({ status: "okay", total: fetchingUser.total })
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
        const productIndex = req.body.index;
        const priceString = req.body.price;
        const price = parseInt(priceString)
        const qtynumber = req.body.qtynumber;
        if (qtynumber >= 1) {
            const fetchingUser = await User.findOne({ email: req.session.user })
            fetchingUser.cart[productIndex].qty = qtynumber;
            fetchingUser.total -= price
            fetchingUser.save()
            res.json({ status: "okay", total: fetchingUser.total })
        } else {
            res.json({ status: "minimum1" })
        }

    } catch (error) {
        console.log(error);
    }
}

//========================================= User checkout page rendering ==============================================

const checkingCheckout = async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.session.user });
        const productData = await Product.find({});
        const ProductResultarray = [];
        let nextpage = true;
        if (userData) {
            for (let i = 0; i < userData.cart.length; i++) {
                const cartproductIdString = userData.cart[i].productID.toString();
                for (let j = 0; j < productData.length; j++) {
                    const productIdString = productData[j]._id.toString();
                    if (cartproductIdString === productIdString) {
                        ProductResultarray.push(productData[j]);
                        break;
                    }
                }
                if (userData.cart[i].qty === 0 || userData.cart[i].qty > ProductResultarray[i].stock) {
                    nextpage = false;
                    break;
                }
            }
        }
        if (nextpage === true) {
            res.json({ status: "okay" })
        } else {
            res.json({ status: "missingqty" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= User checkout page rendering ==============================================

const checkout = async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.session.user });
        const productData = await Product.find({});
        const ProductResultarray = [];
        if (userData) {
            for (let i = 0; i < userData.cart.length; i++) {
                const cartproductIdString = userData.cart[i].productID.toString();
                for (let j = 0; j < productData.length; j++) {
                    const productIdString = productData[j]._id.toString();
                    if (cartproductIdString === productIdString) {
                        ProductResultarray.push(productData[j]);
                        break;
                    }
                }
            }
        }
        res.render("user/checkoutpage", { userData, ProductResultarray })
    } catch (error) {
        console.log(error);
    }
}

//========================================= User checkout page rendering ==============================================

const checkoutPost = async (req, res) => {
    try {
        const addressID = req.body.addressChecked;
        const payment = req.body.paymentchecked;

        const userData = await User.findOne({ email: req.session.user });
        const productData = await Product.find({});
        const orderProducts = [];
        let address;
        let nextpage = false;
        if (userData) {
            for (let i = 0; i < userData.cart.length; i++) {
                const cartproductIdString = userData.cart[i].productID.toString();
                for (let j = 0; j < productData.length; j++) {
                    const productIdString = productData[j]._id.toString();
                    if (cartproductIdString === productIdString) {
                        if (productData[j].stock >= userData.cart[i].qty) {
                            orderProducts.push(productData[j])
                            nextpage = true;
                        } else {
                            nextpage = false;
                            break;
                        }
                    }
                }
            }
            for (let i = 0; i < userData.address.length; i++) {
                const stringID = userData.address[i]._id.toString();
                if (stringID === addressID) {
                    address = userData.address[i]
                }
            }
            const orderData = {
                product: orderProducts,
                address: address,
                orderID: idGenerator(),
                userEmail: req.session.user,
                date: dateGenerator(),
                total: userData.total,
                itemsCount: userData.cart.length,
                paymentMethod: payment
            }
            if (nextpage) {
                const orderProcess = await Order.create(orderData);
                if(orderProcess){
                    res.json({ status: "true" })
                } else{
                    res.json({ status: "network" })
                }
                
            } else {
                res.json({ status: "stocklimit" })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= User order successfully page rendering ==============================================

const orderSuccessfull = async (req, res) => {
    try {
        res.render("user/orderSuccess")
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
    cartMinus,
    checkingCheckout,
    checkout,
    checkoutPost,
    orderSuccessfull
}