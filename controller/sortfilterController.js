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

//========================================= category sort ajax call rendering ==============================================

const categorysort = async (req, res) => {
    try {
        const ajaxCategory = req.body.category;
        req.session.categorySearch = ajaxCategory;
        let products;
        if(ajaxCategory === "All"){
            products = await Product.find({isBlocked : false});
        }else{
            products = await Product.find({categoryID : ajaxCategory , isBlocked : false});
        }
        res.json({status : "okay" , products : products})
    } catch (error) {
        console.log(error);
    }
}

//========================================= category and price sort ajax call rendering ==============================================

const pricesort = async (req, res) => {
    try {
        const ajaxPrice = req.body.pricerange;
        let products;

        if(req.session.categorySearch){
            if(ajaxPrice === "lowToHigh"){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({isBlocked : false}).sort({offerPrice : 1})
                } else{
                    products = await Product.find({ categoryID : req.session.categorySearch , isBlocked : false}).sort({offerPrice : 1})
                }
            }else{
                if(req.session.categorySearch === "All"){
                    products = await Product.find({isBlocked : false}).sort({offerPrice : -1})
                } else{
                    products = await Product.find({ categoryID : req.session.categorySearch , isBlocked : false}).sort({offerPrice : -1});
                }
            }
        } else{
            if(ajaxPrice === "lowToHigh"){
                products = await Product.find({isBlocked : false}).sort({offerPrice : 1})
            }else{
                products = await Product.find({isBlocked : false}).sort({offerPrice : -1})
            }
        }
        res.json({status : "okay" , products : products})
    } catch (error) {
        console.log(error);
    }
}

//========================================= category and rating sort ajax call rendering ==============================================

const ratingsort = async (req, res) => {
    try {
        const starCount = parseInt(req.body.star);
        let products;
        if(req.session.categorySearch){
            if(starCount === 5){
                products = await Product.find({categoryID : req.session.categorySearch , avgStar : starCount , isBlocked : false});
            }
            if(starCount === 4){
                products = await Product.find({categoryID : req.session.categorySearch , avgStar : starCount , isBlocked : false});
            }
            if(starCount === 3){
                products = await Product.find({categoryID : req.session.categorySearch , avgStar : starCount , isBlocked : false});
            }
            if(starCount === 2){
                products = await Product.find({categoryID : req.session.categorySearch , avgStar : starCount , isBlocked : false});
            }
            if(starCount === 1){
                products = await Product.find({categoryID : req.session.categorySearch , avgStar : starCount , isBlocked : false});
            }
        } else{
            if(starCount === 5){
                products = await Product.find({ avgStar : starCount , isBlocked : false});
            }
            if(starCount === 4){
                products = await Product.find({ avgStar : starCount , isBlocked : false});
            }
            if(starCount === 3){
                products = await Product.find({ avgStar : starCount , isBlocked : false});
            }
            if(starCount === 2){
                products = await Product.find({ avgStar : starCount , isBlocked : false});
            }
            if(starCount === 1){
                products = await Product.find({ avgStar : starCount , isBlocked : false});
            }
        }
        res.json({status : "okay" , products : products})
    } catch (error) {
        console.log(error);
    }
}


//========================================= Sort product based on name Ascending order ==============================================

// const nameascending = async (req, res) => {
//     try {
//         const productDetails = await Product.find({isBlocked: false}).sort({ name: 1 })
//         res.render("user/userAllProduct", { productDetails })
//     } catch (error) {
//         console.log(error);
//     }
// }

// //========================================= Sort product based on name ascending order ==============================================

// const namedescending = async (req, res) => {
//     try {
//         const productDetails = await Product.find({isBlocked: false}).sort({ name: -1 })
//         res.render("user/userAllProduct", { productDetails })
//     } catch (error) {
//         console.log(error);
//     }
// }

// //========================================= Sort product based on 5 star rated products ==============================================

// const fiverated = async (req, res) => {
//     try {
//         const productDetails = await Product.find({isBlocked: false , avgStar : 5})
//         res.render("user/userAllProduct", { productDetails })
//     } catch (error) {
//         console.log(error);
//     }
// }

// //========================================= Sort product based on 4 star rated products ==============================================

// const fourrated = async (req, res) => {
//     try {
//         const productDetails = await Product.find({isBlocked: false , avgStar : 4})
//         res.render("user/userAllProduct", { productDetails })
//     } catch (error) {
//         console.log(error);
//     }
// }

// //========================================= Sort product based on 3 star rated products ==============================================

// const threerated = async (req, res) => {
//     try {
//         const productDetails = await Product.find({isBlocked: false , avgStar : 3})
//         res.render("user/userAllProduct", { productDetails })
//     } catch (error) {
//         console.log(error);
//     }
// }

// //========================================= Sort product based on 2 star rated products ==============================================

// const tworated = async (req, res) => {
//     try {
//         const productDetails = await Product.find({isBlocked: false , avgStar : 2})
//         res.render("user/userAllProduct", { productDetails })
//     } catch (error) {
//         console.log(error);
//     }
// }

// //========================================= Sort product based on 1 star rated products ==============================================

// const onerated = async (req, res) => {
//     try {
//         const productDetails = await Product.find({isBlocked: false , avgStar : 1})
//         res.render("user/userAllProduct", { productDetails })
//     } catch (error) {
//         console.log(error);
//     }
// }

// //========================================= Sort product based on name ascending order ==============================================

// const leatest = async (req, res) => {
//     try {
//         const productDetails = await Product.find({isBlocked: false}).sort({ _id: -1 })
//         res.render("user/userAllProduct", { productDetails })
//     } catch (error) {
//         console.log(error);
//     }
// }

// //========================================= Sort product based on name ascending order ==============================================

// const oldest = async (req, res) => {
//     try {
//         const productDetails = await Product.find({isBlocked: false}).sort({ _id: 1 })
//         res.render("user/userAllProduct", { productDetails })
//     } catch (error) {
//         console.log(error);
//     }
// }

//========================================= Export all modules ==============================================

module.exports = {
    allproduct,
    categorysort,
    pricesort,
    ratingsort,
    // fiverated,
    // fourrated,
    // threerated,
    // tworated,
    // onerated,
    // nameascending,
    // namedescending,
    // leatest,
    // oldest,
}