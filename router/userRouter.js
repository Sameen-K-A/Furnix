const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");
const isLogged = require("../Middleware/isLogged.js");



router.get("/" , userController.userhomeGET);
router.get('/userLogin' , userController.userLogin);
router.post('/userLoginpost' , userController.userLoginpost)
router.get('/userRegister' , userController.userRegister);
router.post('/userRegisterpost' , userController.userRegisterpost);
router.get("/userRegisterOTP" , userController.userRegisterOTP);
router.post('/userRegisterOTPpost' , userController.userRegisterOTPpost);
router.post('/userRegisterResentOTPpost' , userController.userRegisterResentOTPpost)
router.get('/userForgetPassword' , userController.userForgetPassword);
router.post('/userForgetPasswordpost' , userController.userForgetPasswordpost)
router.get("/userForgetOTP" , userController.userForgetOTP)
router.post("/userForgetOTPpost" , userController.userForgetOTPpost);
router.post("/userforgetResentOTPpost" , userController.userforgetResentOTPpost);
router.get("/userLogout" , userController.userLogout);
router.get("/productDetailspage" , userController.productDetailspage)




module.exports = router;