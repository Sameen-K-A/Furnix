const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const productController = require("../controller/productController");
const {isAdmin} = require("../Middleware/isLogged")
const upload = require("../controller/multer folder/multer");

router.get("/" , adminController.adminLogin);
router.post("/adminloginPost" , adminController.adminLoginPOST);
router.get("/adminHome" ,isAdmin, adminController.adminHome);
router.get("/adminUserList" ,isAdmin, adminController.adminUserList);
router.get("/userBlock" ,isAdmin, adminController.userBlock);
router.get("/userUnblock" ,isAdmin, adminController.userUnblock);
router.get("/category" ,isAdmin, adminController.category);
router.post("/categoryAdd" ,isAdmin, adminController.categoryAdd);
router.get("/blockCategory" ,isAdmin, adminController.blockCategory);
router.get("/UnblockCategory" ,isAdmin, adminController.UnblockCategory);
router.get("/editcategory" ,isAdmin, adminController.editcategory);
router.post("/adminEditPOST" ,isAdmin, adminController.catEditPOST);
router.get("/adminLogout" ,isAdmin, adminController.adminLogout);

// product rout

router.get("/productPage" ,isAdmin, productController.productPage);
router.get("/productinfo" , isAdmin , productController.productinfo)
router.get("/addProduct" ,isAdmin, productController.addProduct);
router.post("/addProductPOST",isAdmin, upload.array("image" , 5)  ,productController.addProductPOST);
router.post("/editproductImagePOST", isAdmin, upload.single("image"), productController.editproductImagePOST);
router.get("/editproduct" ,isAdmin, productController.editproduct);
router.post("/editProductPOST" ,isAdmin, productController.editproductPOST);
router.get("/unlistproduct" ,isAdmin, productController.unlistproduct);
router.get("/listproduct" ,isAdmin, productController.listproduct);

//Order side routes
router.get("/order" ,isAdmin , adminController.orderget);
router.get("/orderInfo" , isAdmin , adminController.orderInfo);
router.post("/changeStatus" , isAdmin , adminController.statusChanger);

module.exports = router;