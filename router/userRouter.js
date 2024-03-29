const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");
const userProfileController = require("../controller/userProfileController.js");
const cartController = require("../controller/cartController.js");
const sortFilterController = require("../controller/sortfilterController.js");
const countFunction = require("../Middleware/cartWishCount.js")
const { isBlocked ,isUser , isNoUser , isProductBlocked} = require("../Middleware/isLogged.js");

router.use(countFunction);

router.use((req, res, next) => {
    if (req.method === 'GET') {
        if(req.session.categorySearch){
            delete req.session.categorySearch
        }
    }
    next();
});

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
router.get("/allproduct" , isBlocked, sortFilterController.allproduct);
router.post("/categorysort" , isBlocked, sortFilterController.categorysort);
router.post("/pricesort" , isBlocked, sortFilterController.pricesort);
router.post("/ratingsort" , isBlocked, sortFilterController.ratingsort);
router.post("/nameSort" , isBlocked, sortFilterController.nameSort);
router.post("/dateSort" , isBlocked, sortFilterController.dateSort);

// product review;
router.post("/feedback" , isUser , isBlocked , userController.feedback);
router.patch("/feedback" , isUser , isBlocked , userController.feedbackedit);
router.delete("/deleteFeedback" , isUser , isBlocked , userController.deleteFeedback);

// user change passwords area
router.get("/changepassword" , isUser , isBlocked , userProfileController.changepassword);
router.patch("/changepassword" , isUser , isBlocked , userProfileController.changepasswordPost);

// user account details
router.get("/accountDetails" , isUser , isBlocked , userProfileController.accountDetails);
router.get("/editdetails" , isUser , isBlocked, userProfileController.editdetails)
router.post("/editdetails" , isUser , isBlocked , userProfileController.editdetailspost)

// user address area
router.get("/address" ,  isUser , isBlocked , userProfileController.addressGet);
router.post("/address" ,  isUser , isBlocked , userProfileController.addressPOST);
router.delete("/address" , isUser , isBlocked , userProfileController.deleteAddress);
router.get("/addressedit" , isUser , isBlocked , userProfileController.editAddressget);
router.patch("/address" , isUser , isBlocked , userProfileController.editAddress);

// user order details
router.get("/orders" , isUser , isBlocked , userProfileController.orders);
router.get("/vieworderinfo" , isUser , isBlocked , userProfileController.vieworderinfo);
router.post("/cancelOrder" , isUser , isBlocked , userProfileController.cancelOrder);
router.post("/cancelreturnOrder" , isUser , isBlocked , userProfileController.cancelreturnOrder);
router.post("/returnorder" , isUser , isBlocked , userProfileController.returnorder);

// user cart side 
router.get("/cart" , isBlocked , cartController.cartpage);
router.post("/cart" ,  isBlocked , cartController.cartpagepost);
router.delete("/cart" ,isUser ,  isBlocked , cartController.deleteproduct);
router.post("/cartPlus" , isBlocked ,  cartController.cartPlus);
router.post("/cartMinus" , isBlocked , cartController.cartMinus);

// user checkout page
router.get("/checkingCheckout" , isUser , isBlocked , cartController.checkingCheckout)
router.get("/checkout" , isUser , isBlocked , cartController.checkout);
router.post("/checkout" , isUser , isBlocked , cartController.checkoutPost);
router.post("/razorpaysuccess" , isUser , isBlocked , cartController.razorpaysuccess);
router.post("/razorpayfailed" , isUser , isBlocked , cartController.razorpayfailed);
router.get("/orderSuccessfull" , isUser , isBlocked , cartController.orderSuccessfull);

// failed payment
router.post("/payFailedpayment" , isUser , isBlocked , userProfileController.payFailedpayment);
router.post("/pendingpaymentSuccess" , isUser , isBlocked , userProfileController.pendingpaymentSuccess);


//user wishlist side
router.get("/wishlist" , userController.wishlistget);
router.post("/wishlist" , userController.wishlistpost);
router.delete("/wishlist" , userController.deletewish);

// user Coupon side
router.get("/Coupons" , isUser , isBlocked, userProfileController.coupons);
router.post("/applyCoupon" , isUser , isBlocked, cartController.applyCoupon);

// search products
router.post("/search" , userController.search)

// wallet
router.get("/wallet" , isUser , isBlocked , userProfileController.wallet);
router.post("/wallet" , isUser , isBlocked , userProfileController.walletpost);
router.post("/successwallet" , isUser , isBlocked , userProfileController.successwallet);

// invoice
router.get("/invoice" ,isUser , isBlocked , userProfileController.invoice);
router.post("/invoice" ,isUser , isBlocked , userProfileController.invoicepost);

// contact and about page
router.get("/contact" , userController.contact);
router.post("/contact" , userController.contactPost);



module.exports = router;