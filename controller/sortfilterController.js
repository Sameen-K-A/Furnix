const Product = require("../model/productModel");
const Category = require("../model/categoryModel");

//========================================= All product page rendering ==============================================

const allproduct = async (req, res) => {
    try {
        const productDetails = await Product.find({ isBlocked: false });
        const catDetails = await Category.find({isBlocked : false})
        res.render("user/userAllProduct", { productDetails , catDetails});
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on name Ascending order ==============================================

const nameascending = async (req, res) => {
    try {
        const productDetails = await Product.find({isBlocked: false}).sort({ name: 1 })
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on name ascending order ==============================================

const namedescending = async (req, res) => {
    try {
        const productDetails = await Product.find({isBlocked: false}).sort({ name: -1 })
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on 5 star rated products ==============================================

const fiverated = async (req, res) => {
    try {
        const productDetails = await Product.find({isBlocked: false , avgStar : 5})
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on 4 star rated products ==============================================

const fourrated = async (req, res) => {
    try {
        const productDetails = await Product.find({isBlocked: false , avgStar : 4})
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on 3 star rated products ==============================================

const threerated = async (req, res) => {
    try {
        const productDetails = await Product.find({isBlocked: false , avgStar : 3})
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on 2 star rated products ==============================================

const tworated = async (req, res) => {
    try {
        const productDetails = await Product.find({isBlocked: false , avgStar : 2})
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on 1 star rated products ==============================================

const onerated = async (req, res) => {
    try {
        const productDetails = await Product.find({isBlocked: false , avgStar : 1})
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on name ascending order ==============================================

const leatest = async (req, res) => {
    try {
        const productDetails = await Product.find({isBlocked: false}).sort({ _id: -1 })
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Sort product based on name ascending order ==============================================

const oldest = async (req, res) => {
    try {
        const productDetails = await Product.find({isBlocked: false}).sort({ _id: 1 })
        res.render("user/userAllProduct", { productDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Export all modules ==============================================

module.exports = {
    fiverated,
    fourrated,
    threerated,
    tworated,
    onerated,
    allproduct,
    nameascending,
    namedescending,
    leatest,
    oldest,
}