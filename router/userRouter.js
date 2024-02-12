const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");
const userProfileController = require("../controller/userProfileController.js");
const { isBlocked ,isUser , isNoUser , isProductBlocked} = require("../Middleware/isLogged.js");



router.get("/" , isBlocked , userController.userhomeGET);
router.get('/userLogin'  , isNoUser , isBlocked , userController.userLogin);
router.post('/userLoginpost' , isNoUser ,  userController.userLoginpost);
router.get("/userprofilepage" , isBlocked , userController.userProfilePage)
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
router.get("/productDetailspage" , isProductBlocked  ,isBlocked,  userController.productDetailspage);

// user profile information
router.get("/changepassword" , isUser , isBlocked , userProfileController.changepassword);
router.patch("/changepassword" , isUser , isBlocked , userProfileController.changepasswordPost);
router.get("/accountDetails" ,  isUser , isBlocked , userProfileController.accountDetails);

// user address side
router.get("/address" ,  isUser , isBlocked , userProfileController.addressGet);
router.post("/address" ,  isUser , isBlocked , userProfileController.addressPOST);
router.delete("/address" , isUser , isBlocked , userProfileController.deleteAddress);
router.get("/addressedit" , isUser , isBlocked , userProfileController.editAddressget)
router.patch("/address" , isUser , isBlocked , userProfileController.editAddress);




module.exports = router;