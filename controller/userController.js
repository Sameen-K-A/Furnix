const User = require("../model/userModel");
const Product = require("../model/productModel");
const GenerateOTP = require("../controller/OTP controller/GenerateOTP");
const sendOTPmail = require("../controller/OTP controller/sendOTP");
const bcrypt = require("bcrypt");

//========================================= Render default page ==============================================

const userhomeGET = async (req, res) => {
    try {
        const productDetails = await Product.find({ isBlocked: false }).limit(4).sort({ _id: -1 });
        res.render("user/userHome", { productDetails });
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
            const userData = await User.findOne({ email: req.session.user });
            res.render("user/userProfile", { userData });
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
        const checkemail = await User.findOne({ email: email });
        if (!checkemail) {
            if (registeruserphone.length >= 10) {
                const checkphone = await User.findOne({ phone: registeruserphone });
                if (!checkphone) {
                    if (registeruserpass.length >= 8) {
                        if (registeruserpass === registeruserconfpass) {
                            const serverSideOTP = GenerateOTP();
                            sendOTPmail(email, serverSideOTP);
                            const secretPass = await hashPassword(registeruserpass)
                            req.session.tempuserDetail = {
                                registerusername,
                                email,
                                registeruserphone,
                                secretPass,
                                serverOTP: serverSideOTP
                            }
                            res.json({ status: true });
                        } else {
                            res.json({ status: "confpass" });
                        }
                    } else {
                        res.json({ status: "passlength" });
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
            try {
                const UserData = {
                    name: req.session.tempuserDetail.registerusername,
                    email: req.session.tempuserDetail.email,
                    phone: req.session.tempuserDetail.registeruserphone,
                    password: req.session.tempuserDetail.secretPass
                }
                const newUser = await User.create(UserData);
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
                if (forgetpassword === forgetconfpassword) {
                    const newforgetOTP = GenerateOTP();
                    const frogetOTP_mail = sendOTPmail(forgetemail, newforgetOTP);
                    req.session.userforgetTEMP = {
                        email: forgetemail,
                        registeruserpass: forgetpassword,
                        OTPserverSide: newforgetOTP
                    }
                    res.json({ status: true })
                } else {
                    res.json({ status: "passwrong" })
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
                const updatePass = await User.updateOne({ email: req.session.userforgetTEMP.email }, { password: req.session.userforgetTEMP.registeruserpass });
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
        const productID = req.query.id;
        const userData = await User.findOne({email : req.session.user});
        const productDetails = await Product.findOne({ _id: productID });
        res.render("user/productDetails", { productDetails , userData})
    } catch (error) {
        console.log(error);
    }
}

//========================================= user Logout area ==============================================

const userLogout = (req, res) => {
    try {
        delete req.session.user;
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
}

//========================================= All product page rendering ==============================================

const allproduct = async (req, res) => {
    try {
        const productDetails = await Product.find({ isBlocked: false });
        res.render("user/userAllProduct", { productDetails });
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on price Secsending order ==============================================

const pricehightolow = async (req, res) => {
    try {
        const productDetails = await Product.find({}).sort({ regularPrice: -1 })
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on price Ascending order ==============================================

const pricelowtohigh = async (req, res) => {
    try {
        const productDetails = await Product.find({}).sort({ regularPrice: 1 })
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on name Ascending order ==============================================

const nameascending = async (req, res) => {
    try {
        const productDetails = await Product.find({}).sort({ name: 1 })
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on name ascending order ==============================================

const namedescending = async (req, res) => {
    try {
        const productDetails = await Product.find({}).sort({ name: -1 })
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on name ascending order ==============================================

const leatest = async (req, res) => {
    try {
        const productDetails = await Product.find({}).sort({ _id: -1 })
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on name ascending order ==============================================

const oldest = async (req, res) => {
    try {
        const productDetails = await Product.find({}).sort({ _id: 1 })
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= search product based on user entered name  ==============================================

const search = async (req, res) => {
    try {
        const searchValue = req.body.searchValue;
        let productList = false
        productList = await Product.find({name : {$regex : '.*' + searchValue + '.*' , $options : 'i'}}).limit(5);
        console.log(productList);
    } catch (error) {
        console.log(error);
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
    allproduct,
    pricehightolow,
    pricelowtohigh,
    nameascending,
    namedescending,
    leatest,
    oldest,
    search
}