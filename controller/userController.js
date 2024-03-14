const User = require("../model/userModel");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");
const Rating = require('../model/ratingModel');
const Wishlist = require("../model/wishlistModel");
const GenerateOTP = require("../controller/OTP controller/GenerateOTP");
const sendOTPmail = require("../controller/OTP controller/sendOTP");
const dateGenerator = require("../config/dateGenerator");
const randomID = require("../config/randomID");
const bcrypt = require("bcrypt");
const Coupon = require("../model/coupenModel");
const Category = require("../model/categoryModel");
const Wallet = require("../model/walletModel");

//========================================= Render default page ==============================================

const userhomeGET = async (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const productDetails = await Product.find({ isBlocked: false }).limit(4).sort({ _id: -1 });
        const catData = await Category.find({});
        const offerBanner = [];
        for (let i = 0; i < catData.length; i++) {
            if(catData[i].OfferDiscount !== 0){
                offerBanner.push(catData[i])
            }
        }
        const sortedOfferBanner = offerBanner.sort((a, b) => new Date(b.createDate) - new Date(a.createDate)).slice(0, 3);

        // 2 random product for banner displaying
        const randomProduct = await Product.aggregate([{ $match: {} },{ $sample: { size: 2 } }]);
        res.render("user/userHome", { productDetails , sortedOfferBanner , randomProduct , CartCount , wishCount});
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render user login page ==============================================

const userLogin = (req, res) => {
    try {
        res.render("user/userLogin")
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render user profile page ==============================================

const userProfilePage = async (req, res) => {
    try {
        if (req.session.user) {
            const CartCount = req.session.CartCount
            const wishCount = req.session.wishCount
            const userData = await User.findOne({ email: req.session.user });
            res.render("user/userProfile", { userData , CartCount , wishCount});
        } else {
            res.redirect("/userLogin");
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= checking  user email and password is correct  ==============================================

const userLoginpost = async (req, res) => {
    try {
        const ajaxEmail = req.body.useremail;
        const ajaxPass = req.body.userpass;
        const loginUser = await User.findOne({ email: ajaxEmail });
        if (loginUser) {
            const comparePassword = await bcrypt.compare(ajaxPass, loginUser.password)
            if (comparePassword) {
                if (loginUser.isBlocked === false) {
                    req.session.user = ajaxEmail
                    res.json({ status: true })
                } else {
                    res.json({ status: "userBlock" })
                }
            } else {
                res.json({ status: "passwordwrong" })
            }
        } else {
            res.json({ status: false })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render user register page ==============================================

const userRegister = (req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/userLogin")
        } else {
            res.render('user/userRegister')
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Password hashing function ==============================================

const hashPassword = async (password) => {
    try {
        const hashed = await bcrypt.hash(password, 10);
        return hashed;
    } catch (error) {
        console.log(error);
    }
}

//========================================= Checking user register body details is correct ==============================================

const userRegisterpost = async (req, res) => {
    try {
        const registerusername = req.body.registername;
        const email = req.body.registeremail;
        const registeruserphone = req.body.registernumber;
        const registeruserpass = req.body.registerpassword;
        const registeruserconfpass = req.body.registerconfpass;
        const registerReferralCode = req.body.registerrefercode
        const checkemail = await User.findOne({ email: email });
        if (!checkemail) {
            if (registeruserphone.length >= 10) {
                const checkphone = await User.findOne({ phone: registeruserphone });
                if (!checkphone) {
                    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(registeruserpass)) {
                        if (registeruserpass.length >= 8) {
                            if (registeruserpass === registeruserconfpass) {
                                let matched = false
                                let referral = false;
                                if(registerReferralCode.length !=0){
                                    const referedUser = await User.findOne({referCode : registerReferralCode});
                                    if(referedUser){
                                        matched = referedUser.email
                                        referral = false;
                                    } else{
                                        referral = true
                                    }
                                }else{
                                    referral = false;
                                }
                                if(referral === false){
                                    const serverSideOTP = GenerateOTP();
                                    sendOTPmail(email, serverSideOTP);
                                    const secretPass = await hashPassword(registeruserpass)
                                    req.session.tempuserDetail = {
                                        registerusername,
                                        email,
                                        registeruserphone,
                                        secretPass,
                                        serverOTP: serverSideOTP,
                                        referUser : matched
                                    }
                                    console.log(req.session.tempuserDetail);
                                    res.json({ status: true });
                                } else{
                                    res.json({status : "refcodeerror"})
                                }
                            } else {
                                res.json({ status: "confpass" });
                            }
                        } else {
                            res.json({ status: "passlength" });
                        }
                    } else {
                        res.json({ status: "passstrength" });
                    }
                } else {
                    res.json({ status: "numberexist" })
                }
            } else {
                res.json({ status: "numberlength" })
            }
        } else {
            res.json({ status: "existEmail" });
        }
    } catch (error) {
        console.log(error);
    }
}

//======================================================== Check OTP is correct and valid ======================================================================

const userRegisterOTP = (req, res) => {
    try {
        res.render("user/userRegisterOTP")
        console.log(req.session.tempuserDetail);
    } catch (error) {
        console.log(error);
    }
}

//======================================================== user Register OTP page render ======================================================================

const userRegisterOTPpost = async (req, res) => {
    try {
        const serverOTP = req.session.tempuserDetail.serverOTP;
        const userSideOTP = req.body.userSideOTP;
        if (serverOTP === userSideOTP) {
            const referelcode = "FURNIX" + randomID();
            try {
                const UserData = {
                    name: req.session.tempuserDetail.registerusername,
                    email: req.session.tempuserDetail.email,
                    phone: req.session.tempuserDetail.registeruserphone,
                    password: req.session.tempuserDetail.secretPass,
                    referCode : referelcode,
                    createdOn : dateGenerator()
                }
                const newUser = await User.create(UserData);
                // Coupons pushing
                const availcoupons = await Coupon.find({couponStatus : {$in : ["Active" , "Awaiting"]}});
                for (let i = 0; i < availcoupons.length; i++) {
                    availcoupons[i].availableUsers.push(newUser._id.toString())
                    await availcoupons[i].save();
                }
                newUser.save();

                // referral reward;
                if(req.session.tempuserDetail.referUser){
                    const referedUser = await User.findOne({email : req.session.tempuserDetail.referUser})
                    const referedUserWallet = await Wallet.findOne({userID : referedUser._id});
                    if(referedUserWallet){
                        const newTransaction = {
                            transactionID : "Furnix" + randomID(),
                            amount : 200,
                            date : dateGenerator(),
                            status : "Reward"
                        }
                        referedUserWallet.transactions.push(newTransaction);
                        referedUserWallet.walletAmount +=200;
                        referedUserWallet.save();
                    } else{
                        const newData = {
                            userID : referedUser._id,
                            walletAmount : 500,
                            transactions : {
                                transactionID : "Furnix" + randomID(),
                                amount : 200,
                                date : dateGenerator(),
                                status : "Reward"
                            }
                        };
                        await Wallet.create(newData);
                    }

                    // new user also get reward
                    const newUserWalletData = {
                        userID : newUser._id,
                        walletAmount : 200,
                        transactions : {
                            transactionID : "Furnix" + randomID(),
                            amount : 200,
                            date : dateGenerator(),
                            status : "Reward"
                        }
                    };
                    await Wallet.create(newUserWalletData);
                }

                // end referral reward side and delete session
                delete req.session.tempuserDetail;
                res.json({ status: true })
            } catch (error) {
                console.log(error);
            }
        } else {
            res.json({ status: false })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Register Resend OTP side ==============================================

const userRegisterResentOTPpost = (req, res) => {
    try {
        const email = req.session.tempuserDetail.email;
        const serverSideOTP = GenerateOTP();
        req.session.tempuserDetail.serverOTP = serverSideOTP;
        sendOTPmail(email, serverSideOTP)
        res.json({ status: true })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render forget password page ==============================================

const userForgetPassword = (req, res) => {
    try {
        res.render('user/userForgetPass')
    } catch (error) {
        console.log(error);
    }
}

//========================================= Check new password is valid ==============================================

const userForgetPasswordpost = async (req, res) => {
    try {
        const { forgetemail, forgetpassword, forgetconfpassword } = req.body;
        const forgetUserinfo = await User.findOne({ email: forgetemail });
        if (forgetUserinfo) {
            if (forgetpassword.length >= 8) {
                if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(forgetpassword)) {
                    if (forgetpassword === forgetconfpassword) {
                        const newforgetOTP = GenerateOTP();
                        sendOTPmail(forgetemail, newforgetOTP);
                        const secretPass = await hashPassword(forgetpassword)
                        req.session.userforgetTEMP = {
                            email: forgetemail,
                            registeruserpass: secretPass,
                            OTPserverSide: newforgetOTP
                        }
                        res.json({ status: true })
                    } else {
                        res.json({ status: "passwrong" })
                    }
                } else {
                    res.json({ status: "newpassstrength" });
                }
            } else {
                res.json({ status: "passlength" })
            }
        } else {
            res.json({ status: "gmailnotfound" });
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= render forget OTP page ==============================================

const userForgetOTP = (req, res) => {
    try {
        res.render("user/userForgetOTP");
    } catch (error) {
        console.log(error);
    }
}

//========================================= check entered OTP is valid ==============================================

const userForgetOTPpost = async (req, res) => {
    try {
        const userEnterOTP = req.body.userSideOTP;
        if (userEnterOTP === req.session.userforgetTEMP.OTPserverSide) {
            try {
                await User.updateOne({ email: req.session.userforgetTEMP.email }, { password: req.session.userforgetTEMP.registeruserpass });
                res.json({ status: true })
            } catch (error) {
                console.log(error);
            }
        } else {
            res.json({ status: false });
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= resend forget OTP ==============================================

const userforgetResentOTPpost = (req, res) => {
    try {
        const resendForgetOTP = GenerateOTP();
        req.session.userforgetTEMP.OTPserverSide = resendForgetOTP;
        sendOTPmail(req.session.userforgetTEMP.email, req.session.userforgetTEMP.OTPserverSide);
        res.json({ status: true })
    } catch (error) {
        console.log(error);
    }
}

//========================================= user watch product details  ==============================================

const productDetailspage = async (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const productID = req.query.id;
        const userData = await User.findOne({ email: req.session.user });
        const productDetails = await Product.findOne({ _id: productID });
        let boughtProductID = false;
        let wishproduct = false;
        const ratingData = await Rating.find({ productID: productID })
        if (userData) {
            const boughtProduct = await Order.find({ userEmail: req.session.user});
            for (let i = 0; i < boughtProduct.length; i++) {
                if(boughtProduct[i].deliveredDateTime != false){
                    for (let j = 0; j < boughtProduct[i].product.length; j++) {
                        const boughtProductString = boughtProduct[i].product[j]._id.toString();
                        if (productID === boughtProductString) {
                            boughtProductID = productID;
                            break;
                        }
                    }
                }
            }
            // wishlist checking
            const wishlistData = await Wishlist.findOne({userID : userData._id})
            if(wishlistData){
                for(let i=0 ; i< wishlistData.products.length ; i++){
                    if(productDetails._id.toString() === wishlistData.products[i].productID.toString()){
                        wishproduct = true;
                        break;
                    }
                }
            }
        }
        res.render("user/productDetails", { productDetails, userData, boughtProductID, ratingData, wishproduct , CartCount , wishCount})
    } catch (error) {
        console.log(error);
    }
}

//========================================= user Logout area ==============================================

const userLogout = (req, res) => {
    try {
        delete req.session.user;
        delete req.session.CartCount;
        delete req.session.wishCount;
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
}

//========================================= search product based on user entered name  ==============================================

const feedback = async (req, res) => {
    try {
        const starcount = parseInt(req.body.star);
        const feedbackreview = req.body.feedback;
        const productid = req.body.productid;
        const userData = await User.findOne({ email: req.session.user });
        const productData = await Product.findOne({ _id: productid });

        const ratingDetails = {
            productID: productData._id,
            name: userData.name,
            email: userData.email,
            date: dateGenerator(),
            description: feedbackreview,
            star: starcount
        }
        const data = await Rating.create(ratingDetails);
        if (data) {
            const ratingData = await Rating.find({ productID: productid }, { star: true });
            let totalStar = 0;
            for (let i = 0; i < ratingData.length; i++) {
                totalStar += ratingData[i].star
            };
            const avgratingstar = totalStar / ratingData.length;
            const nearestInteger = Math.round(avgratingstar);
            productData.avgStar = nearestInteger;
            productData.save();
            res.json({ status: "updated" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Wishlist page render  ==============================================

const wishlistget = async (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const userData = await User.findOne({ email: req.session.user });
        const wishProducts = [];
        if(userData){
            const wishData  = await Wishlist.findOne({ userID : userData._id });
            const productData = await Product.find({isBlocked : false})
            if (wishData) {
                for(let i=0 ; i <wishData.products.length ; i++){
                    for(let j=0 ; j<productData.length ; j++){
                        if(wishData.products[i].productID.toString() === productData[j]._id.toString()){
                            wishProducts.push(productData[j])
                        }
                    }
                }
            }
        }
        res.render("user/wishlist", { userData , wishProducts , CartCount , wishCount})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Wishlist page render  ==============================================

const wishlistpost = async (req, res) => {
    try {
        const productID = req.body.id;
        const userData = await User.findOne({ email: req.session.user });
        if (userData) {
            const productData = await Product.findOne({ _id: productID });
            if (productData.isBlocked === false) {
                const checkwish = await Wishlist.findOne({ userID: userData._id });
                if (checkwish) {
                    const data = {
                        productID: productData._id,
                        date: dateGenerator()
                    }
                    await Wishlist.updateOne({ userID: userData._id }, { $push: { products: data } });
                    res.json({ status: "okay" })
                } else {
                    const wishschema = {
                        userID: userData._id,
                        products: [{
                            productID: productData._id,
                            date: dateGenerator()
                        }]
                    }
                    await Wishlist.create(wishschema);
                    res.json({ status: "okay" })
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

//========================================= Wishlist page render  ==============================================

const deletewish = async (req, res) => {
    try {
        const productID = req.body.id;
        const userData = await User.findOne({ email: req.session.user });
        if (userData) {
            const productData = await Product.findOne({ _id: productID });
            if (productData.isBlocked === false) {
                await Wishlist.updateOne({userID : userData._id} , {$pull :{products : {productID : productData._id}}});
                res.json({status : "okay"})
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

//========================================= search products ==============================================

const search = async (req, res)=>{
    try {
        const searchName = req.body.searchValue;
        if(searchName){
            const products = await Product.find({ name: { $regex: searchName, $options: 'i' } }).limit(5);
            if(products.length !=0){
                res.json({status : "okay" , products : products})
            }else{
                res.json({status : "Notfound"})
            }
        }
    } catch (error) {
        
    }
}
//========================================= Export all modules ==============================================

module.exports = {
    userhomeGET,
    userLogin,
    userLoginpost,
    userProfilePage,
    userRegister,
    userRegisterpost,
    userRegisterOTP,
    userRegisterOTPpost,
    userForgetPassword,
    userForgetPasswordpost,
    userRegisterResentOTPpost,
    userForgetOTP,
    userForgetOTPpost,
    userforgetResentOTPpost,
    userLogout,
    productDetailspage,
    feedback,
    wishlistget,
    wishlistpost,
    deletewish,
    search
}