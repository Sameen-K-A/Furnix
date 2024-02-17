const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");
const userProfileController = require("../controller/userProfileController.js");
const cartController = require("../controller/cartController.js");
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

//user all product page and sorting

router.get("/allproduct" ,isBlocked, userController.allproduct);
router.get("/pricehightolow" ,isBlocked, userController.pricehightolow);
router.get("/pricelowtohigh" ,isBlocked, userController.pricelowtohigh);
router.get("/nameascending" ,isBlocked, userController.nameascending);
router.get("/namedescending" ,isBlocked, userController.namedescending);
router.get("/leatest" ,isBlocked, userController.leatest);
router.get("/oldest" ,isBlocked, userController.oldest);
router.post("/search" , isBlocked , userController.search)

// user change passwords area

router.get("/changepassword" , isUser , isBlocked , userProfileController.changepassword);
router.patch("/changepassword" , isUser , isBlocked , userProfileController.changepasswordPost);

// user account details

router.get("/accountDetails" ,  isUser , isBlocked , userProfileController.accountDetails);
router.get("/editdetails" ,isUser , isBlocked, userProfileController.editdetails)
router.post("/editdetails" ,isUser , isBlocked , userProfileController.editdetailspost)

// user address area

router.get("/address" ,  isUser , isBlocked , userProfileController.addressGet);
router.post("/address" ,  isUser , isBlocked , userProfileController.addressPOST);
router.delete("/address" , isUser , isBlocked , userProfileController.deleteAddress);
router.get("/addressedit" , isUser , isBlocked , userProfileController.editAddressget);
router.patch("/address" , isUser , isBlocked , userProfileController.editAddress);

// user cart side 
router.get("/cart" , isBlocked , cartController.cartpage);
router.post("/cart" , isBlocked , cartController.cartpagepost);
router.delete("/cart" , isBlocked , cartController.deleteproduct);
router.post("/cartPlus" , isBlocked ,  cartController.cartPlus);
router.post("/cartMinus" , isBlocked , cartController.cartMinus)



module.exports = router;