const Coupon = require("../model/coupenModel");
const date = require("../config/dateGenerator");
const randomID = require("../config/randomID");
const User = require("../model/userModel");

//========================================= admin coupon page render ==============================================

const coupenget = async (req, res) => {
    try {
        const coupens = await Coupon.find({}).sort({_id : -1});
        const currentDate = new Date(date());
        for (let i = 0; i < coupens.length; i++) {
            const expairyDate = new Date(coupens[i].endDate)
            if(currentDate > expairyDate){
                coupens[i].couponStatus = "Expired";
                await coupens[i].save()
                break;
            }
            const startingDate = new Date(coupens[i].startDate)
            if(currentDate == startingDate){
                coupens[i].couponStatus = "Active";
                await coupens[i].save()
                break;
            }
        }
        res.render("admin/coupons" , {coupens})
    } catch (error) {
        console.log(error);
    }
}

//========================================= admin new add coupon page rendering ==============================================

const addCoupen = async (req, res) => {
    try {
        res.render("admin/addCoupon")
    } catch (error) {
        console.log(error);
    }
}

//========================================= new coupon post side ==============================================

const addCoupenPost = async (req, res) => {
    try {
        let offer_StartingDate = req.body.startingDate;
            offer_StartingDate = offer_StartingDate.replace(/-/g, '/');
        let offer_EndingDate = req.body.endingDate;
            offer_EndingDate = offer_EndingDate.replace(/-/g, '/');
        const offer_CouponName = req.body.name;
        let   offer_MinimumAmount = parseInt(req.body.minimumAmount);
        let   offer_MaximumAmount = parseInt(req.body.maximumAmount);
        const offer_Percentage = parseInt(req.body.discountamount);
        let couponStatus;
        const currentDate = date()
        if (offer_StartingDate === currentDate) {
            couponStatus = "Active"
        }else{
            couponStatus  = "Awaiting"
        }
        const newCouponData = {
            name : offer_CouponName,
            startDate : offer_StartingDate,
            endDate : offer_EndingDate,
            coupencode : "Furnix" + randomID(),
            minBuyRate : offer_MinimumAmount,
            maxBuyRate : offer_MaximumAmount,
            discountPercentage : offer_Percentage,
            couponStatus : couponStatus
        }
        const insertProcess = await Coupon.create(newCouponData);
        if(insertProcess){
            const users = await User.find({});
            for (let i = 0; i < users.length; i++) {
                insertProcess.availableUsers.push(users[i]._id.toString())
            }
            insertProcess.save()
            res.json({status : "okay"})
        }else{
            res.json({status : "oops"})
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= delete coupon side ==============================================

const BlockCoupon = async (req, res)=>{
    try {
        const blockID = req.body.id;
        const blockProcess = await Coupon.updateOne({_id: blockID} , {isBlocked : true});
        if (blockProcess.modifiedCount === 1) {
            return res.json({ status: "okay" });
        } else {
            return res.json({ status: "oops" });
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= delete coupon side ==============================================

const couponUnblock = async (req, res)=>{
    try {
        const unblockID = req.body.id;
        const blockProcess = await Coupon.updateOne({_id: unblockID} , {isBlocked : false});
        if (blockProcess.modifiedCount === 1) {
            return res.json({ status: "okay" });
        } else {
            return res.json({ status: "oops" });
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Exporting all modules ==============================================

module.exports = {
    coupenget,
    addCoupen,
    addCoupenPost,
    BlockCoupon,
    couponUnblock
}