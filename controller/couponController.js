const User = require("../model/userModel");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");
const Rating = require('../model/ratingModel');
const Wishlist = require("../model/wishlistModel");
const Coupon = require("../model/coupenModel");

const coupenget = async (req, res) => {
    const coupens = await Coupon.find({});
    res.render("admin/coupons")
}

const addCoupen = async (req, res) => {
    res.render("admin/addCoupon")
}

module.exports = {
    coupenget,
    addCoupen
}