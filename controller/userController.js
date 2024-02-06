const User = require("../model/userModel");
const Product = require("../model/productModel");
const GenerateOTP = require("../controller/OTP controller/GenerateOTP");
const sendOTPmail = require("../controller/OTP controller/sendOTP");

//========================================= Render default page ==============================================

const userhomeGET = async (req, res) => {
    try {
        const productDetails = await Product.find({ isBlocked: false });
        res.render("user/userHome", { productDetails });
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render user login page ==============================================

const userLogin = (req, res) => {
    try {

        if (req.session.useremail) {
            res.render("user/userProfile");
        } else {
            res.render("user/userLogin")
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
            if (ajaxPass === loginUser.password) {
                if (loginUser.isBlocked === false) {
                    console.log(`${ajaxEmail} Entering to home page`);
                    req.session.useremail = ajaxEmail;
                    res.json({ status: true })
                } else {
                    console.log("Admin blocked this user");
                    res.json({ status: "userBlock" })
                }
            } else {
                console.log("ENtered password is wrong");
                res.json({ status: "passwordwrong" })
            }
        } else {
            console.log("email not found");
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
                            req.session.tempuserDetail = {
                                registerusername,
                                email,
                                registeruserphone,
                                registeruserpass,
                                serverOTP: serverSideOTP
                            }
                            res.json({ status: true });
                        } else {
                            console.log("Both password is not match");
                            res.json({ status: "confpass" });
                        }
                    } else {
                        console.log("Password must need morethan 8 charecter");
                        res.json({ status: "passlength" });
                    }
                } else {
                    console.log("Phone number already existed");
                    res.json({ status: "numberexist" })
                }
            } else {
                console.log("Enter valid number");
                res.json({ status: "numberlength" })
            }
        } else {
            console.log("this email already existed");
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
        console.log(serverOTP);
        const userSideOTP = req.body.userSideOTP;
        if (serverOTP === userSideOTP) {
            try {
                const UserData = {
                    name: req.session.tempuserDetail.registerusername,
                    email: req.session.tempuserDetail.email,
                    phone: req.session.tempuserDetail.registeruserphone,
                    password: req.session.tempuserDetail.registeruserpass
                }
                const newUser = await User.create(UserData);
                console.log("new user registration successfully");
                delete req.session.tempuserDetail;
                res.json({ status: true })
            } catch (error) {
                console.log(error);
            }
        } else {
            res.json({ status: false })
            console.log("Enter Valid OTP");
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
                    console.log("check password both password are same");
                    res.json({ status: "passwrong" })
                }
            } else {
                console.log("forget password must need more that 8 character");
                res.json({ status: "passlength" })
            }
        } else {
            console.log("gmai not found");
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
                console.log(req.session.userforgetTEMP.email, " Changed old password");
                res.json({ status: true })
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("OTP is wrong");
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
        console.log(req.session.userforgetTEMP);
        res.json({ status: true })
    } catch (error) {
        console.log(error);
    }
}

//========================================= user watch product details  ==============================================

const productDetailspage = async (req, res) => {
    try {
        const productID = req.query.id;
        const productDetails = await Product.findOne({ _id: productID });
        res.render("user/productDetails", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= user Logout area ==============================================

const userLogout = (req, res) => {
    try {
        if (req.session.useremail) {
            req.session.destroy();;
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Export all modules ==============================================

module.exports = {
    userhomeGET,
    userLogin,
    userLoginpost,
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
    productDetailspage
}