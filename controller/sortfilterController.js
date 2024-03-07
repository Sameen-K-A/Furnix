const Product = require("../model/productModel");
const Category = require("../model/categoryModel");

//========================================= All product page rendering ==============================================

const allproduct = async (req, res) => {
    try {
        const productDetails = await Product.find({ isBlocked: false });
        const catDetails = await Category.find({isBlocked : false})
        const offerBanner = [];
        for (let i = 0; i < catDetails.length; i++) {
            if(catDetails[i].OfferDiscount !== 0){
                offerBanner.push(catDetails[i])
            }
        }
        const sortedOfferBanner = offerBanner.sort((a, b) => new Date(b.createDate) - new Date(a.createDate)).slice(0, 3);
        res.render("user/userAllProduct", { productDetails , catDetails , sortedOfferBanner});
    } catch (error) {
        console.log(error);
    }
}

//========================================= All product page rendering ==============================================

const categorysort = async (req, res) => {
    try {
        const ajaxCategory = req.body.category;
        const products = await Product.find({categoryID : ajaxCategory , isBlocked : false});
        res.json({status : "okay" , products : products})
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
    categorysort,
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