const express = require('express');
const User = require("../model/userModel");
const GenerateOTP = require("../controller/OTP controller/GenerateOTP");
const sendOTPmail = require("../controller/OTP controller/sendOTP");
const session = require('express-session');


//========================================= Render default page ==============================================

const userhomeGET = (req, res) => {
    try {
        res.render("userHome");
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render user login page ==============================================

const userLogin = (req, res) => {
    try {
        if (req.session.user) {
            res.render("userProfile");
        } else {
            res.render("userLogin")
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= checking  user email and password is correct  ==============================================

const userLoginpost = async (req, res) => {
    try {
        const userloginemail = req.body.userloginemail;
        const userloginpassword = req.body.userloginpassword;
        const userinfo = await User.findOne({ email: userloginemail })
        if (userinfo) {
            if (userinfo.password === userloginpassword) {
                req.session.user = userloginemail;
                res.redirect('/');
                console.log(`${userloginemail} Entered in the home page`);
            } else {
                console.log("password is wrong");
                res.status(500).json("password is wrong")
            }
        } else {
            console.log("user not fount");
            res.status(500).json("user not fount")
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
            res.render('userRegister')
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Checking user register body details is correct ==============================================

const userRegisterpost = async (req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/userLogin")
        } else {
            const { registerusername, email, registeruserphone, registeruserpass, registeruserconfpass } = req.body;

            const checkemail = await User.findOne({ email: email });
            if (!checkemail) {                                               // checking this email already existed
                if (registeruserpass.length >= 8) {                        // checking password length >= 8;
                    if (registeruserpass === registeruserconfpass) {       // checking password and confirm password are same
                        if (registeruserphone.length === 10) {             //checking phone number length is 10
                            const serverSideOTP = GenerateOTP();
                            const serverSideEmail = sendOTPmail(email, serverSideOTP)
                            req.session.tempuserDetail = {
                                registerusername,
                                email,
                                registeruserphone,
                                registeruserpass,
                                serverSideOTP
                            }
                            res.render('userRegisterOTP')
                        } else {
                            console.log("enter valid phone number");
                        }
                    } else {
                        console.log("enter correct password both password are not match");
                    }
                } else {
                    console.log("password must need morethan 8 character");
                }
            } else {
                console.log("this email already existed");
                res.json("this email already existed")
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//======================================================== Check OTP is correct and valid ======================================================================

const userRegisterOTPpost = async (req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/userLogin")
        } else {
            const serverSideOTP = req.session.tempuserDetail.serverSideOTP;
            const userSideOTP = req.body.registerOTP;
            const UserData = {
                name: req.session.tempuserDetail.registerusername,
                email: req.session.tempuserDetail.email,
                phone: req.session.tempuserDetail.registeruserphone,
                password: req.session.tempuserDetail.registeruserpass
            }
            if (serverSideOTP === userSideOTP) {
                try {
                    const newUser = await User.create(UserData);
                    console.log("new user registration successfully");
                    res.redirect('/userLogin')
                } catch (error) {
                    console.log(error);
                }
            } else {
                res.json("Enter valid OTP")
                console.log("Enter Valid OTP");
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Register Resend OTP side ==============================================

const userRegisterResentOTPpost = (req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/userLogin")
        } else {
            const email = req.session.tempuserDetail.email;
            const serverSideOTP = GenerateOTP();
            req.session.tempuserDetail.serverSideOTP = serverSideOTP;
            sendOTPmail(email, serverSideOTP)
            res.render("userRegisterOTP");
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render forget password page ==============================================

const userForgetPassword = (req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/userLogin")
        } else {
            res.render('userForgetPass')
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Check new password is valid ==============================================

const userForgetPasswordpost = async (req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/userLogin")
        } else {
            const { forgetemail, forgetpassword, forgetconfpassword } = req.body;
            const forgetUserinfo = await User.findOne({ email: forgetemail });
            if (forgetUserinfo) {
                if (forgetpassword.length >= 8) {
                    if (forgetpassword === forgetconfpassword) {
                        const newforgetOTP = GenerateOTP();
                        const frogetOTP_mail = sendOTPmail(forgetemail, newforgetOTP);
                        req.session.tempforgetpassdetails = {
                            forgetemail: forgetemail,
                            forgetpassword: forgetpassword,
                            serverOTP: newforgetOTP
                        }
                        res.redirect('/userForgetOTP')
                    } else {
                        console.log("check password both password are same");
                        res.json("check password both password are same")
                    }
                } else {
                    console.log("forget password must need more that 8 character");
                    res.json("forget password must need more that 8 character")
                }
            } else {
                console.log("gmai not found");
                res.json("gmail not found");
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= render forget OTP page ==============================================

const userForgetOTP = (req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/userLogin")
        } else {
            res.render("userForgetOTP");
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= check entered OTP is valid ==============================================

const userForgetOTPpost = async (req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/userLogin")
        } else {
            const userEnterOTP = req.body.forgetOTP;
            const serverOTP = req.session.tempforgetpassdetails.serverOTP
            if (userEnterOTP === serverOTP) {
                try {
                    const updatePass = await User.updateOne({ email: req.session.tempforgetpassdetails.forgetemail }, { password: req.session.tempforgetpassdetails.forgetpassword });
                    console.log(req.session.tempforgetpassdetails.forgetemail, " Changed old password");
                    res.redirect("/userLogin");
                } catch (error) {
                    console.log(error);
                }
            } else {
                res.json("wrong OTP")
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= resend forget OTP ==============================================

const userforgetResentOTPpost = (req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/userLogin")
        } else {
            const email = req.session.tempforgetpassdetails.forgetemail;
            const resendForgetOTP = GenerateOTP();
            req.session.tempforgetpassdetails.serverOTP = resendForgetOTP;
            sendOTPmail(email, resendForgetOTP);
            res.render("userForgetOTP");
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= user Logout area ==============================================

const userLogout = (req, res) => {
    try {
        if (req.session.user) {
            req.session.destroy();
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
    userRegisterOTPpost,
    userForgetPassword,
    userForgetPasswordpost,
    userRegisterResentOTPpost,
    userForgetOTP,
    userForgetOTPpost,
    userforgetResentOTPpost,
    userLogout
}