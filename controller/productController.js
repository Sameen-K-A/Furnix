const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");

//========================================= rendering product page ==============================================

const productPage = async (req, res) => {
    try {
        const catData = await Category.find({});
        const product = await Product.find({});
        res.render("admin/productPage", { catData, product })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Add new product page rendering ==============================================

const addProduct = async (req, res) => {
    try {
        const categories = await Category.find({ isBlocked: true });
        res.render("admin/addProduct", { categories })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Add new product post to server ==============================================

const addProductPOST = async (req, res) => {
    try {
        const { name, description, category, regularPrice, capacity, material, stock, color } = req.body;
        const images = req.files.map(file => file.originalname);
        const productData = {
            name,
            description,
            category,
            regularPrice,
            capacity,
            material,
            stock,
            color,
            images
        }
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
        const catDetails = await Category.find({ isBlocked: true });
        res.render("admin/editproduct", { productDetails, catDetails })
    } catch (error) {
        console.log(error);
    }
}



const editproductPOST = async (req, res) => {
    try {
        const productID = req.query.id;
        const newImages = req.files.map(elems => elems.originalname)
        if (newImages) {
            const updateImgStage = await Product.updateOne({ _id: productID }, { $push: { images: { $each: newImages } } })
        }
        const { name, description, category, regularPrice, capacity, material, stock, color } = req.body;
        const editProDetails = {
            name: name,
            description: description,
            category: category,
            regularPrice: regularPrice,
            capacity: capacity,
            material: material,
            stock: stock,
            color: color,
        }
        const updateDetails = await Product.updateOne({_id : productID} , editProDetails)
        res.redirect("/admin/productPage");
    } catch (error) {
        console.log(error);
    }
}
//========================================= product list and unlist side ==============================================

const unlistproduct = async (req, res) => {
    try {
        const unlistProID = req.query.id;
        const details = await Product.updateOne({ _id: unlistProID }, { isBlocked: true });
        res.redirect("/admin/productPage");
    } catch (error) {
        console.log(error);
    }
}
const listproduct = async (req, res) => {
    try {
        const listProID = req.query.id;
        const details = await Product.updateOne({ _id: listProID }, { isBlocked: false });
        res.redirect("/admin/productPage");
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
    unlistproduct,
    listproduct
}