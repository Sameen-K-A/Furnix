const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");

//========================================= rendering product page ==============================================

const productPage = async (req, res) => {
    try {
        const product = await Product.find({});
        res.render("admin/productPage", {product })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Add new product page rendering ==============================================

const addProduct = async (req, res) => {
    try {
        const categories = await Category.find({ isBlocked: false });
        res.render("admin/addProduct", { categories })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Add new product post to server ==============================================

const addProductPOST = async (req, res) => {
    try {
        const { name, description, category, regularPrice, offerPrice , capacity, material, stock, color } = req.body;
        const images = req.files.map(file => file.originalname);
        const catID = await Category.findOne({name : category});
        const regPrice = parseInt(regularPrice);
        const offPrice = parseInt(offerPrice);
        const offerPercentage = Math.round(((regPrice - offPrice) / regPrice) * 100)
        const productData = {
            name : name,
            description : description,
            categoryName : catID.name,
            categoryID: catID._id.toString(),
            regularPrice : regularPrice,
            offerPercentage : offerPercentage,
            offerPrice : offerPrice,
            capacity : capacity,
            material : material,
            stock : stock,
            color : color,
            images : images
        }
        console.log(productData);
        await Product.create(productData);
        res.redirect("/admin/productPage")
    } catch (error) {
        console.log(error);
    }
}

//========================================= Edit product page rendering ==============================================

const editproduct = async (req, res) => {
    try {
        const proID = req.query.id;
        const productDetails = await Product.findOne({ _id: proID });
        const catDetails = await Category.find({ isBlocked: false });
        res.render("admin/editproduct", { productDetails, catDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Update Edited details of product ==============================================

const editproductPOST = async (req, res) => {
    try {
        const productID = req.query.id;
        const { name, description, category, regularPrice, offerPrice , capacity, material, stock, color } = req.body;
        const catID = await Category.findOne({name : category});
        const regPrice = parseInt(regularPrice);
        const offPrice = parseInt(offerPrice);
        const offerPercentage = Math.round(((regPrice - offPrice) / regPrice) * 100)
        const editProDetails = {
            name : name,
            description : description,
            categoryName : catID.name,
            categoryID: catID._id.toString(),
            regularPrice : regularPrice,
            offerPercentage : offerPercentage,
            offerPrice : offerPrice,
            capacity : capacity,
            material : material,
            stock : stock,
            color : color
        }
        await Product.updateOne({ _id: productID } , editProDetails)
        res.redirect("/admin/productPage");
    } catch (error) {
        console.log(error);
    }
}

//========================================= Update Edited details of product ==============================================

const editproductImagePOST = async (req, res) => {
    try {
        const image = req.body.imagename;
        const index = parseInt(req.body.index);
        const productID = req.body.productID;
        if(image){
            const productDetails = await Product.findOne({_id : productID});
            productDetails.images.splice(index , 1 , image);
            productDetails.save()
            res.json({status : "okay"})
        }else{
            res.json({status : "oops"})
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= product Unlist side ==============================================

const unlistproduct = async (req, res) => {
    try {
        const unlistProID = req.query.id;
        await Product.updateOne({ _id: unlistProID }, { isBlocked: true });
        res.redirect("/admin/productPage");
    } catch (error) {
        console.log(error);
    }
}

//========================================= product list side ==============================================

const listproduct = async (req, res) => {
    try {
        const listProID = req.query.id;
        await Product.updateOne({ _id: listProID }, { isBlocked: false });
        res.redirect("/admin/productPage");
    } catch (error) {
        console.log(error);
    }
}

//========================================= product list side ==============================================

const productinfo = async (req, res) => {
    try {
        const proID = req.query.id;
        const info = await Product.findById({_id : proID});
        res.render("admin/productInfo" , {info})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Export all modules ==============================================

module.exports = {
    productPage,
    addProduct,
    addProductPOST,
    editproduct,
    editproductPOST,
    editproductImagePOST,
    unlistproduct,
    listproduct,
    productinfo
}