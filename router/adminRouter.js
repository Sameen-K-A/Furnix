const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const productController = require("../controller/productController");
const upload = require("../controller/multer folder/multer");


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



// product rout


router.get("/productPage" , productController.productPage);
router.get("/addProduct" , productController.addProduct);
router.post("/addProductPOST", upload.array("image" , 5)  ,productController.addProductPOST);
router.get("/editproduct" , productController.editproduct);
router.get("/unlistproduct" , productController.unlistproduct);
router.get("/listproduct" , productController.listproduct);

module.exports = router;