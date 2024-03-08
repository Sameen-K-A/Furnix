const User = require("../model/userModel");
const Product = require("../model/productModel");
const Order = require("../model/orderModel")
const dateGenerator = require("../config/dateGenerator");
const idGenerator = require("../config/randomID");
const timeGenerator = require("../config/timeGenerator");
const Coupon = require("../model/coupenModel");
const razorpay = require("razorpay");
const crypto = require("crypto");

// ========================================= instance of razorpay =========================================

const {razorpayKeyID , razorpayKeySecret} = process.env
const razorpayInstance = new razorpay({
    key_id: razorpayKeyID,
    key_secret: razorpayKeySecret
})

//========================================= Cart page rendering ==============================================

const cartpage = async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.session.user });
        const productData = await Product.find({});
        const ProductResultarray = [];
        let total =0;
        if (userData) {
            for (let i = 0; i < userData.cart.length; i++) {
                const cartproductIdString = userData.cart[i].productID.toString();
                for (let j = 0; j < productData.length; j++) {
                    const productIdString = productData[j]._id.toString();
                    if (cartproductIdString === productIdString) {
                        ProductResultarray.push(productData[j]);
                        total += userData.cart[i].qty * productData[j].offerPrice;
                        userData.total = total
                        if (productData[j].stock === 0) {
                            userData.total -= userData.cart[i].qty * productData[j].offerPrice;
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
            if (product.isBlocked === false) {
                await User.updateOne({ email: req.session.user }, { $push: { cart: obj }, $inc: { total: product.offerPrice } });
                res.json({ status: "okay" })
            } else {
                res.json({ status: "blocked" })
            }
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
            if (fetchingProducts.stock >= qtynumber) {
                if (qtynumber <= 10) {
                    if (fetchingProducts.isBlocked === false) {
                        fetchingUser.cart[productIndex].qty = qtynumber;
                        fetchingUser.total += price;
                        fetchingUser.save()
                        res.json({ status: "okay", total: fetchingUser.total })
                    } else {
                        res.json({ status: "blocked" })
                    }
                } else {
                    res.json({ status: "limitReached" })
                }
            } else {
                res.json({ status: "stocknotavailable" })
            }
        } else {
            res.json({ status: "notlogin" })
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
        const fetchingUser = await User.findOne({ email: req.session.user })
        if (fetchingUser) {
            fetchingProducts = await Product.findOne({ _id: fetchingUser.cart[productIndex].productID });
            if (fetchingProducts.isBlocked === false) {
                if (qtynumber >= 1) {
                    fetchingUser.cart[productIndex].qty = qtynumber;
                    fetchingUser.total -= price
                    fetchingUser.save()
                    res.json({ status: "okay", total: fetchingUser.total })
                } else {
                    res.json({ status: "minimum1" })
                }
            } else {
                res.json({ status: "blocked" })
            }
        } else {
            res.json({ status: "notlogin" })
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

                        if (productData[j].isBlocked === false) {
                            ProductResultarray.push(productData[j]);
                            break;
                        } else {
                            res.json({ status: "blocked" })
                        }

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

//========================================= User coupon apply side ajax call  ==============================================

const applyCoupon = async (req, res)=>{
    try {
        const userCouponcode = req.body.code;
        const coupon = await Coupon.findOne({coupencode : userCouponcode});
        const user = await User.findOne({email : req.session.user});
        if(coupon){
            let cpnFound = false;
            for (let i = 0; i < coupon.availableUsers.length; i++) {
                if(user._id.toString() === coupon.availableUsers[i]){
                    cpnFound = true;
                    break;
                }
            }
            if(cpnFound){
                if(coupon.isBlocked === false){
                    if(coupon.couponStatus === "Active"){
                        if(user.total >= coupon.minBuyRate && coupon.maxBuyRate >= user.total){
                            const total_amount = user.total;
                            const descount_percentage = coupon.discountPercentage;
                            let balanceAmount = total_amount - (total_amount * (descount_percentage / 100));
                            balanceAmount.toFixed(1)
                            res.json({ status: "okay", balance: balanceAmount });
                        } else{
                            res.json({ status: "minAmount", minamount: coupon.minBuyRate , maxAmount : coupon.maxBuyRate});
                        }
                    } else{
                        res.json({status : "notfound"});
                    }
                } else{
                    res.json({status : "notfound"});
                }
            }else{
                res.json({status : "notfound"});
            }
        } else{
            res.json({status : "notfound"})
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= User checkout page post store datas to database  ==============================================

const checkoutPost = async (req, res) => {
    try {
        const addressID = req.body.addressChecked;
        const payment = req.body.paymentchecked;
        const userData = await User.findOne({ email: req.session.user });
        const productData = await Product.find({});
        const usedCouponCode = req.body.couponUsed;
        const orderProducts = [];
        let address;
        // let notworking = false;
        let nextpage = false;
        if (userData) {
            for (let i = 0; i < userData.cart.length; i++) {
                const cartproductIdString = userData.cart[i].productID.toString();
                for (let j = 0; j < productData.length; j++) {
                    const productIdString = productData[j]._id.toString();
                    if (cartproductIdString === productIdString) {
                        if (productData[j].isBlocked === false) {
                            if (productData[j].stock >= userData.cart[i].qty) {
                                orderProducts.push(productData[j]);
                                nextpage = true;
                            } else {
                                nextpage = false;
                                break;
                            }
                        } else {
                            // notworking = true
                            res.json({ status: "blocked" })
                        }
                    }
                }
            }
            // set subtotal
            const subTotal = userData.total;

            // coupon ckecking
            let couponOffer = 0;
            let couponCode = false;
            if(usedCouponCode != undefined){
                const findCoupon = await Coupon.findOne({coupencode : usedCouponCode});
                if(findCoupon.isBlocked === false){
                    couponCode = findCoupon.coupencode;
                    let newTotal = userData.total - (userData.total * (findCoupon.discountPercentage / 100))
                    couponOffer = userData.total - newTotal
                    userData.total = newTotal;
                    userData.save()
                }
            }

            // store full aaddress details
            for (let i = 0; i < userData.address.length; i++) {
                const stringID = userData.address[i]._id.toString();
                if (stringID === addressID) {
                    address = userData.address[i];
                }
            }

            // quantity of all items
            for (let i = 0; i < orderProducts.length; i++) {
                for (let j = 0; j < userData.cart.length; j++) {
                    orderProducts[i].cartQty = userData.cart[i].qty;
                }
            }
            // create new order data
            const orderData = {
                product: orderProducts,
                address: address,
                orderID: idGenerator(),
                userEmail: req.session.user,
                date: dateGenerator(),
                time: timeGenerator(),
                total: userData.total,
                subTotal : subTotal,
                itemsCount: userData.cart.length,
                paymentMethod: payment,
                couponOffer : couponOffer,
                couponCode : couponCode
            }

            // cash on delivery
            if(payment === "Cash on delivery"){
                if (nextpage) {
                    const orderProcess = await Order.create(orderData);
                    if (orderProcess) {
                        if(usedCouponCode != undefined){
                            // pull that userID from coupons available users and push that userID into redeemed user list into coupon
                            const removeID = userData._id.toString();
                            await Coupon.updateOne({ coupencode: usedCouponCode },{$pull: { availableUsers: removeID }, $push: { redeemedUsers: removeID }});
                        }
                        res.json({ status: "true"  })
                    } else {
                        res.json({ status: "network" })
                    }
                } else {
                    res.json({ status: "stocklimit" });
                }
            }


            // razorpay
            else if(payment === "Razorpay"){
                if (nextpage) {
                    // create a option for razorpay
                    const options = {
                        amount: userData.total * 100,
                        currency: 'INR',
                        receipt: userData._id+idGenerator()+timeGenerator()
                    };

                    // create a new order for razorpay
                    razorpayInstance.orders.create(options , async (error , order)=>{
                        if(error){
                            res.json({status : "razorpayfailed"})
                        } else{
                            res.json({status : "razorpaytrue" , razorpayOrder : order , orderDetails : orderData})
                        }
                    })
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= User order successfully page rendering ==============================================

const razorpaysuccess = async (req, res) => {
    try {
        const {response , orderDetails} = req.body;
        const userData = await User.findOne({email : req.session.user});
        if(userData){
            // hmac checking
            let hmac=crypto.createHmac('sha256',razorpayKeySecret);
            hmac.update(response.razorpay_order_id+"|"+response.razorpay_payment_id)
            hmac=hmac.digest("hex")
            if(hmac == response.razorpay_signature){
                // creating order
                const orderProcess = await Order.create(orderDetails);
                    if (orderProcess) {
                        if(orderDetails.couponCode != "false"){
                            console.log("coupon used");
                            // pull that userID from coupons available users and push that userID into redeemed user list into coupon
                            const removeID = userData._id.toString();
                            await Coupon.updateOne({ coupencode: orderDetails.couponCode },{$pull: { availableUsers: removeID }, $push: { redeemedUsers: removeID }});
                        }
                        res.json({ status: "true"  })
                    } else {
                        res.json({ status: "network" })
                    }
            }else{
                console.log("falied");
                res.json({status : "somthingwrong"})
            }
        }

    } catch (error) {
        console.log(error);
    }
}

//========================================= User order successfully page rendering ==============================================

const orderSuccessfull = async (req, res) => {
    try {
        const productData = await Product.find({});
        const userData = await User.findOne({ email: req.session.user });
        for (let i = 0; i < userData.cart.length; i++) {
            for (let j = 0; j < productData.length; j++) {
                const cartString = userData.cart[i].productID.toString();
                const productString = productData[j]._id.toString();
                if (cartString === productString) {
                    productData[j].stock -= userData.cart[i].qty;
                    await productData[j].save();
                    break;
                }
            }
        }
        userData.cart = [];
        userData.total = 0;
        userData.save()
        res.render("user/orderSuccess");
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
    applyCoupon,
    checkoutPost,
    razorpaysuccess,
    orderSuccessfull
}