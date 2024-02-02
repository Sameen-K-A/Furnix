const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");


router.get("/" , adminController.adminLogin);
router.post("/adminloginPost" , adminController.adminLoginPOST);
router.get("/adminHome" , adminController.adminHome);
router.get("/adminUserList" , adminController.adminUserList);
router.get("/userBlock" , adminController.userBlock);
router.get("/userUnblock" , adminController.userUnblock);
router.get("/category" , adminController.category);
router.post("/categoryAdd" , adminController.categoryAdd);
router.get("/blockCategory" , adminController.blockCategory);
router.get("/UnblockCategory" , adminController.UnblockCategory);
router.get("/editcategory" , adminController.editcategory);
router.post("/adminEditPOST" , adminController.adminEditPOST);
router.get("/productPage" , adminController.productPage);
router.get("/addProduct" , adminController.addProduct);
router.post("/addProductPOST" , adminController.addProductPOST);


module.exports = router;