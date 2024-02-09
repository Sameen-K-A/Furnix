const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");
const { isBlocked , isNoUser , isProductBlocked} = require("../Middleware/isLogged.js");



router.get("/" , isBlocked , userController.userhomeGET);
router.get('/userLogin'  , isNoUser , isBlocked , userController.userLogin);
router.get("/userProfile" , userController.userProfile);
router.post('/userLoginpost' , isNoUser ,  userController.userLoginpost)
router.get('/userRegister' , isNoUser , userController.userRegister);
router.post('/userRegisterpost' , isNoUser, userController.userRegisterpost);
router.get("/userRegisterOTP" , isNoUser , userController.userRegisterOTP);
router.post('/userRegisterOTPpost' , isNoUser , userController.userRegisterOTPpost);
router.post('/userRegisterResentOTPpost' , isNoUser , userController.userRegisterResentOTPpost)
router.get('/userForgetPassword' , isNoUser , userController.userForgetPassword);
router.post('/userForgetPasswordpost' , isNoUser , userController.userForgetPasswordpost)
router.get("/userForgetOTP" , isNoUser , userController.userForgetOTP)
router.post("/userForgetOTPpost" , isNoUser , userController.userForgetOTPpost);
router.post("/userforgetResentOTPpost" , isNoUser , userController.userforgetResentOTPpost);
router.get("/userLogout" , userController.userLogout);
router.get("/productDetailspage" , isProductBlocked  ,isBlocked,  userController.productDetailspage)




module.exports = router;