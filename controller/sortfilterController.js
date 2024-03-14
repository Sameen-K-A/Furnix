const Product = require("../model/productModel");
const Category = require("../model/categoryModel");

//========================================= All product page rendering ==============================================

const allproduct = async (req, res) => {
    try {
        const CartCount = req.session.CartCount
        const wishCount = req.session.wishCount
        const productDetails = await Product.find({ isBlocked: false });
        const catDetails = await Category.find({isBlocked : false})
        const offerBanner = [];
        for (let i = 0; i < catDetails.length; i++) {
            if(catDetails[i].OfferDiscount !== 0){
                offerBanner.push(catDetails[i])
            }
        }
        const sortedOfferBanner = offerBanner.sort((a, b) => new Date(b.createDate) - new Date(a.createDate)).slice(0, 3);
        res.render("user/userAllProduct", { productDetails , catDetails , sortedOfferBanner , CartCount , wishCount});
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
                if(req.session.categorySearch === "All"){
                    products = await Product.find({avgStar : starCount , isBlocked : false});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch , avgStar : starCount , isBlocked : false});
                }
            }
            if(starCount === 4){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({avgStar : starCount , isBlocked : false});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch , avgStar : starCount , isBlocked : false});
                }
            }
            if(starCount === 3){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({avgStar : starCount , isBlocked : false});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch , avgStar : starCount , isBlocked : false});
                }
            }
            if(starCount === 2){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({avgStar : starCount , isBlocked : false});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch , avgStar : starCount , isBlocked : false});
                }
            }
            if(starCount === 1){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({avgStar : starCount , isBlocked : false});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch , avgStar : starCount , isBlocked : false});
                }
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

//========================================= category and name based sort ajax call rendering ==============================================

const nameSort = async (req, res) => {
    try {
        const sortingType = req.body.value;
        let products;
        if(req.session.categorySearch){
            if(sortingType === "default"){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({isBlocked : false});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch , isBlocked : false});
                }
            }
            if(sortingType === "ascending"){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({isBlocked : false}).sort({name : 1});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch ,isBlocked : false}).sort({name : 1});
                }
            }
            if(sortingType === "descending"){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({isBlocked : false}).sort({name : -1});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch ,isBlocked : false}).sort({name : -1});
                }
            }
        } else{
            if(sortingType === "default"){
                products = await Product.find({isBlocked : false});
            }
            if(sortingType === "ascending"){
                products = await Product.find({isBlocked : false}).sort({name : 1});
            }
            if(sortingType === "descending"){
                products = await Product.find({isBlocked : false}).sort({name : -1});
            }
        }
        res.json({status : "okay" , products : products})
    } catch (error) {
        console.log(error);
    }
}

//========================================= category and name based sort ajax call rendering ==============================================

const dateSort = async (req, res) => {
    try {
        const sortingType = req.body.value;
        let products;
        if(req.session.categorySearch){
            if(sortingType === "default"){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({isBlocked : false});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch , isBlocked : false});
                }
            }
            if(sortingType === "new"){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({isBlocked : false}).sort({_id : -1});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch ,isBlocked : false}).sort({_id : -1});
                }
            }
            if(sortingType === "old"){
                if(req.session.categorySearch === "All"){
                    products = await Product.find({isBlocked : false}).sort({_id : 1});
                } else{
                    products = await Product.find({categoryID : req.session.categorySearch ,isBlocked : false}).sort({_id : 1});
                }
            }
        } else{
            if(sortingType === "default"){
                products = await Product.find({isBlocked : false});
            }
            if(sortingType === "new"){
                products = await Product.find({isBlocked : false}).sort({_id : -1});
            }
            if(sortingType === "old"){
                products = await Product.find({isBlocked : false}).sort({_id : 1});
            }
        }
        res.json({status : "okay" , products : products})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Export all modules ==============================================

module.exports = {
    allproduct,
    categorysort,
    pricesort,
    ratingsort,
    nameSort,
    dateSort
}