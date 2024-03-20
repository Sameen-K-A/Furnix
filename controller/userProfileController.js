const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const Coupon = require("../model/coupenModel");
const Wallet = require("../model/walletModel");
const razorpay = require("razorpay");
const crypto = require("crypto");
const idGenerator = require("../config/randomID");
const timeGenerator = require("../config/timeGenerator");
const dateGenerator = require("../config/dateGenerator")

// ========================================= instance of razorpay =========================================

const {razorpayKeyID , razorpayKeySecret} = process.env
const razorpayInstance = new razorpay({
    key_id: razorpayKeyID,
    key_secret: razorpayKeySecret
});

//========================================= inside user profile page change password session rendering ==============================================

const changepassword = (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        res.render("userProfile/userChangePassword" , {CartCount , wishCount});
    } catch (error) {
        console.log(error);
    }
}

//========================================= Password updating area ==============================================

const changepasswordPost = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body
        const user = await User.findOne({ email: req.session.user });
        const userDBpassword = user.password
        const comparePassword = await bcrypt.compare(currentPassword, userDBpassword);
        if (comparePassword) {

            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(newPassword)){
                if (newPassword.length >= 8) {
                    if (newPassword === confirmPassword) {
                        const hashPassword = await bcrypt.hash(newPassword, 10);
                        await User.updateOne({ email: req.session.user }, { password: hashPassword });
                        res.json({ status: true })
                    } else {
                        res.json({ status: "bothpasswrong" })
                    }
                } else {
                    res.json({ status: "newpasslength" })
                }
            } else{
                res.json({ status: "newpassstrength" });
            }


            
        } else {
            res.json({ status: "currentwrong" })
        }
    } catch (error) {
        console.log()
    }
}

//========================================= Render user account details  ==============================================

const accountDetails = async (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const userDetails = await User.findOne({ email: req.session.user })
        res.render("userProfile/userAccountDetails", { userDetails , CartCount , wishCount})
    } catch (error) {
        console.log(error);
    }
}

//========================================= editing user details page rendering ==============================================

const editdetails = async (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const userDetails = await User.findOne({ email: req.session.user });
        res.render("userProfile/editAccountDetails", { userDetails , CartCount , wishCount});
    } catch (error) {
        console.log(error);
    }
}

//========================================= Update user details editing area==============================================

const editdetailspost = async (req, res) => {
    try {
        const { name, number } = req.body;
        const data = {
            name: name,
            phone: number
        }
        const updateProcess = await User.updateOne({ email: req.session.user }, data);
        if (updateProcess.matchedCount === 1 && updateProcess.modifiedCount == 1) {
            res.json({ status: "success" })
        } else if (updateProcess.matchedCount === 1 && updateProcess.modifiedCount == 0) {
            res.json({ status: "nochange" })
        } else {
            res.json({ status: "wrong" })
        }
    } catch (error) {

    }
}

//========================================= Render user address page ==============================================

const addressGet = async (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const userDetails = await User.findOne({ email: req.session.user });
        res.render("userProfile/userAddress", { userDetails , CartCount , wishCount});
    } catch (error) {
        console.log();
    }
}

//========================================= Adding new user address ==============================================

const addressPOST = async (req, res) => {
    try {
        const { name, number, address, pin, state, district, AddressType, Landmark, altNumber } = req.body;
        const addressData = {
            name: name,
            number: number,
            address: address,
            pin: pin,
            district: district,
            state: state,
            addressType: AddressType,
            landmark: Landmark,
            alternateNumber: altNumber
        }
        const email = req.session.user;
        const updateProcess = await User.updateOne({ email: email }, { $push: { address: addressData } });
        if (updateProcess.modifiedCount === 1) {
            res.json({ status: "success" })
        } else {
            res.json({ status: "wrong" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Delete user address side ==============================================

const deleteAddress = async (req, res) => {
    try {
        const addressID = req.body.ID;
        const deleteProcess = await User.updateOne({ email: req.session.user }, { $pull: { address: { _id: addressID } } });
        if (deleteProcess.modifiedCount == 1) {
            res.json({ status: "deleted" });
        } else {
            res.json({ status: "wrong" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Editing user address area ==============================================

const editAddressget = async (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const addressID = req.query.id;
        req.session.editAddressID = addressID;
        const userDetails = await User.findOne({ email: req.session.user });
        const editingAddress = userDetails.address.find(elems => elems._id == addressID)
        res.render("userProfile/editAddress", { editingAddress , CartCount , wishCount});
    } catch (error) {
        console.log(error);
    }
}

//========================================= Update edited address area ==============================================

const editAddress = async (req, res) => {
    try {
        const { name, number, address, pin, state, district, AddressType, Landmark, altNumber } = req.body;
        const address_id = req.session.editAddressID;
        const updateProcess = await User.findOneAndUpdate({ email: req.session.user, 'address._id': address_id },
            {
                $set: {
                    'address.$.name': name,
                    'address.$.number': number,
                    'address.$.address': address,
                    'address.$.pin': pin,
                    'address.$.district': district,
                    'address.$.state': state,
                    'address.$.addressType': AddressType,
                    'address.$.landmark': Landmark,
                    'address.$.alternateNumber': altNumber
                }
            });
        if (updateProcess) {
            res.json({ status: "success" })
        } else {
            res.status({ status: "wrong" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render user profile order page ==============================================

const orders = async (req, res) => {
    try {
        const CartCount = req.session.CartCount;
        const wishCount = req.session.wishCount;
        let orderData = await Order.find({ userEmail: req.session.user }).sort({_id : -1});
        
        const page = parseInt(req.query.page) || 1;
        const NoOfDetailsPage = 5;
        const detailsCount = orderData.length;
        const noOfPages = Math.ceil(detailsCount / NoOfDetailsPage);
        const detailsSkip = (page - 1) * NoOfDetailsPage;
        orderData = orderData.slice(detailsSkip, detailsSkip + NoOfDetailsPage);



        res.render("userProfile/userOrders", { orderData , CartCount , wishCount , noOfPages , page})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render separate order info page ==============================================

const vieworderinfo = async (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const orderID = req.query.id;
        const orderInfodata = await Order.findOne({ _id: orderID });
        res.render("userProfile/orderInfo", { orderInfodata , CartCount , wishCount})
    } catch (error) {
        console.log(error);
    }
}

//========================================= user cancel order ==============================================

const cancelOrder = async (req, res) => {
    try {
        const cancelID = req.body.id;
        const cancelProcess = await Order.updateOne({ _id: cancelID }, { status: "Cancelled" });
        if (cancelProcess.modifiedCount === 1) {    
            const cancelProducts = await Order.findOne({ _id: cancelID });
        //      // recover coupon
            const user = await User.findOne({email : cancelProducts.userEmail});
            const usedCoupon = await Coupon.findOne({coupencode : cancelProducts.couponCode});
            if(usedCoupon != null){
                await Coupon.updateOne({ coupencode: cancelProducts.couponCode },{$push: { availableUsers: user._id.toString() }, $pull: { redeemedUsers: user._id.toString() }});
            }
        //     // product quantity push back
            for (let j = 0; j < cancelProducts.product.length; j++) {
                const cancelProduct = cancelProducts.product[j];
                const product = await Product.findById(cancelProduct._id);
                if (product) {
                    const quantity = parseInt(cancelProduct.cartQty);
                    product.stock += quantity;
                    await product.save();
                }
            }
            // if payment methos is online payment the amount will give back into user wallet
            if(cancelProducts.paymentMethod === "Razorpay"){
                const cancelUser = await User.findOne({email : req.session.user});
                const userWallet = await Wallet.findOne({userID : cancelUser._id});
                if(userWallet){
                    const newTransaction = {
                        transactionID : "Furnix" + idGenerator(),
                        amount : cancelProducts.total,
                        date : dateGenerator(),
                        status : "Order cancel"
                    }
                    userWallet.transactions.push(newTransaction);
                    userWallet.walletAmount += cancelProducts.total;
                    userWallet.save();
                } else{
                    const newData = {
                        userID : cancelUser._id,
                        walletAmount : cancelProducts.total,
                        transactions : {
                            transactionID : "Furnix" + idGenerator(),
                            amount : cancelProducts.total,
                            date : dateGenerator(),
                            status : "Order cancel"
                        }
                    };
                    await Wallet.create(newData);
                }
            }
            res.json({ status: "okay" });
        } else {
            res.json({ status: "oops" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
    }
}

//========================================= user cancel order ==============================================

const cancelreturnOrder = async (req, res) => {
    try {
        const cancelID = req.body.id;
        const cancelProcess = await Order.updateOne({ _id: cancelID }, { status: "Return order cancel" });
        if (cancelProcess.modifiedCount === 1) {
            res.json({ status: "okay" });
        } else {
            res.json({ status: "oops" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
    }
}


//========================================= user cancel order ==============================================

const returnorder = async (req, res) => {
    try {
        const returnID = req.body.id;
        const orderDetails = await Order.updateOne({_id : returnID} , {status : "Return order processing"});
        if(orderDetails.modifiedCount === 1){
            res.json({status : "okay"})
        } else{
            res.json({status : "oops"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
    }
}

//========================================= coupons page render  ==============================================

const coupons = async (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const userData = await User.findOne({email : req.session.user});
        const coupons = await Coupon.find({});
        const userCoupons = [];
        for (let i = 0; i < coupons.length; i++) {
            for(let j = 0 ; j < coupons[i].availableUsers.length ; j++){
                if(userData._id.toString() === coupons[i].availableUsers[j]){
                    userCoupons.push(coupons[i])
                }
            }
        }
        const redeemedCoupons = [];
        for (let i = 0; i < coupons.length; i++) {
            for(let j = 0 ; j < coupons[i].redeemedUsers.length ; j++){
                if(userData._id.toString() === coupons[i].redeemedUsers[j]){
                    redeemedCoupons.push(coupons[i])
                }
            }
        }
        res.render("userProfile/userCoupon" , {userData , userCoupons , redeemedCoupons , CartCount , wishCount})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Wallet rendering ==============================================

const wallet = async (req , res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const userData = await User.findOne({email : req.session.user});
        const userWallet = await Wallet.findOne({userID : userData._id});
        let sortedTransactions;
        let noOfPages;
        let page;
        if (userWallet) {
            page = parseInt(req.query.page) || 1;
            const NoOfDetailsPage = 5;
            const detailsSkip = (page-1) * NoOfDetailsPage;
            const detailsCount = userWallet.transactions.length;
            noOfPages = Math.ceil(detailsCount/NoOfDetailsPage);
            sortedTransactions = userWallet.transactions.sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp()).slice(detailsSkip, detailsSkip + NoOfDetailsPage);
        };
        res.render("userProfile/Wallet" , {userWallet , sortedTransactions , CartCount , wishCount , noOfPages ,page})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Wallet amount post and razorpay starting  ==============================================

const walletpost = async (req , res) => {
    try {
        const userData = await User.findOne({email : req.session.user});
        const amount = parseInt(req.body.amount);
        if(userData){
            const options = {
                amount: amount * 100,
                currency: 'INR',
                receipt: userData._id+idGenerator()+timeGenerator()
            };
    
            // create a new order for razorpay
            razorpayInstance.orders.create(options , async (error , order)=>{
                if(error){
                    res.json({status : "razorpayfailed"})
                } else{
                    res.json({status : "razorpaytrue" , razorpayOrder : order , userData : userData , amount : amount})
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Razorpay wallet payment success controlling  ==============================================

const successwallet = async (req , res) => {
    try {
        const response = req.body.response;
        const amount = parseInt(req.body.amount);
        const userData = await User.findOne({email : req.session.user});
        let hmac=crypto.createHmac('sha256',razorpayKeySecret);
            hmac.update(response.razorpay_order_id+"|"+response.razorpay_payment_id)
            hmac=hmac.digest("hex")
            if(hmac == response.razorpay_signature){
                // search user have already wallet
                const userWallet = await Wallet.findOne({userID : userData._id});
                if(userWallet){
                    const newTransaction = {
                        transactionID : "Furnix" + idGenerator(),
                        amount : amount,
                        date : dateGenerator(),
                        status : "Add on"
                    }
                    userWallet.transactions.push(newTransaction);
                    userWallet.walletAmount +=amount;
                    userWallet.save();
                    res.json({ status : "true"  })
                } else{
                    const newData = {
                        userID : userData._id,
                        walletAmount : amount,
                        transactions : {
                            transactionID : "Furnix" + idGenerator(),
                            amount : amount,
                            date : dateGenerator(),
                            status : "Add on"
                        }
                    };
                    const createProcess = await Wallet.create(newData);
                    if(createProcess){
                        res.json({ status : "true" })
                    } else{
                        res.json({ status : "network" })
                    }
                }
            }else{
                res.json({status : "somthingwrong"})
            }
    } catch (error) {
        console.log(error);
    }
}


//========================================= Invoice download page is rendering ==============================================

const invoicepost = async (req , res) => {
    try {
        const details= req.body.orderID;
        if(details){
            req.session.invoiceID = details;
            res.json({status : "okay"})
        }else{
            res.json({status : "oops"})
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Invoice download page is rendering ==============================================

const invoice = async (req , res) => {
    try {
        const orderData = await Order.findOne({_id : req.session.invoiceID});
        const invoiceData = {
            id : "Invoice" + idGenerator(),
            date : dateGenerator()
        }
        res.render("userProfile/invoice" , {orderData , invoiceData})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Invoice download page is rendering ==============================================

const payFailedpayment = async (req , res) => {
    try {
        const details = req.body.orderDetails;
        let processing = false;
        for (let i = 0; i < details.product.length; i++) {
            const products = details.product[i];
            const orginalProduct = await Product.findOne({_id : products._id });
            if(orginalProduct.isBlocked === false){
                if(products.cartQty <= orginalProduct.stock){
                    // if(details.couponCode !== "false"){
                    //     const usedCoupon = await Coupon.findOne({couponCode : details.couponCode});
                    //     if(usedCoupon.couponStatus === "Expired"){
                    //         processing = false;
                    //         res.json({status : "CouponExpaired"});
                    //     } else{
                    //         processing = true
                    //     }
                    // } else{
                    //     processing = true;
                    // }
                    processing = true;
                } else{
                    processing = false;
                    res.json({status : "stock"});
                    break;
                }
            } else{
                processing = false;
                res.json({status : "Blocked"});
                break;
            }
        }
        if(processing === true){
            const options = {
                amount: details.total * 100,
                currency: 'INR',
                receipt: details._id+idGenerator()+timeGenerator()
            };
    
            // create a new order for razorpay
            razorpayInstance.orders.create(options , async (error , order)=>{
                if(error){
                    res.json({status : "razorpayfailed"})
                } else{
                    res.json({status : "razorpaytrue" , razorpayOrder : order , orderData : details})
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Invoice download page is rendering ==============================================

const pendingpaymentSuccess = async (req , res) => {
    try {
        const {response , orderDetails} = req.body;
        let hmac=crypto.createHmac('sha256',razorpayKeySecret);
        hmac.update(response.razorpay_order_id+"|"+response.razorpay_payment_id)
        hmac=hmac.digest("hex")
        if(hmac == response.razorpay_signature){
            // change order status to ordered;
            const updateProcess = await Order.updateOne({_id : orderDetails._id} , {status : "Ordered"});
            if(updateProcess.modifiedCount === 1){
                for (let i = 0; i < orderDetails.product.length; i++) {
                    const orderedProduct = await Product.findOne({_id : orderDetails.product[i]._id});
                    orderedProduct.stock -= parseInt(orderDetails.product[i].cartQty);
                    await orderedProduct.save()
                }
                res.json({status : "complete"})
            }
        }else{
            res.json({status : "paymentfailed"})
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Exporting all modules ==============================================

module.exports = {
    changepassword,
    changepasswordPost,
    accountDetails,
    editdetails,
    addressGet,
    addressPOST,
    deleteAddress,
    editAddress,
    editAddressget,
    editdetailspost,
    orders,
    vieworderinfo,
    cancelOrder,
    returnorder,
    cancelreturnOrder,
    coupons,
    wallet,
    walletpost,
    successwallet,
    invoicepost,
    invoice,
    payFailedpayment,
    pendingpaymentSuccess
}