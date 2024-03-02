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
            if(coupens[i].couponStatus !== "No expiry date"){
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
        const offer_CouponName = req.body.name;
        let   offer_StartingDate = req.body.startingDate;
        let   offer_EndingDate = req.body.endingDate;
        let   offer_MinimumAmount = parseInt(req.body.minimumAmount);
        const offer_DiscountAmount = parseInt(req.body.discountamount);
        const couponType = req.body.couponType;
        let couponStatus;

        if (!offer_StartingDate) {
            offer_StartingDate = date();
            couponStatus = "Active"
        }else{
            offer_StartingDate = offer_StartingDate.replace(/-/g, '/');
            couponStatus  = "Awaiting"
        }

        if (!offer_EndingDate) {
            offer_EndingDate = "No expiry date";
        }else{
            offer_EndingDate = offer_EndingDate.replace(/-/g, '/');
        }

        if (isNaN(offer_MinimumAmount)) {
            offer_MinimumAmount = 0;
        }

        const newCouponData = {
            name : offer_CouponName,
            startDate : offer_StartingDate,
            endDate : offer_EndingDate,
            coupencode : "Furnix" + randomID(),
            minBuyRate : offer_MinimumAmount,
            discountAmount : offer_DiscountAmount,
            couponType : couponType,
            couponStatus : couponStatus
        }
        const insertProcess = await Coupon.create(newCouponData);
        if(insertProcess){
            if(insertProcess.couponType === "Special"){
                await User.updateMany({} , {$push : {coupens : insertProcess._id.toString()}});
            }
            res.json({status : "okay"})
        }else{
            res.json({status : "oops"})
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= delete coupon side ==============================================

const deleteCoupon = async (req, res)=>{
    try {
        const deletedID = req.body.id;
        const deleteProcess = await Coupon.deleteOne({_id: deletedID});

        if (deleteProcess.deletedCount === 1) {
            const pullProcess = await User.updateMany({},{ $pull: { coupens: deletedID }});
            if (pullProcess.modifiedCount !== 0) {
                return res.json({ status: "okay" });
            } else {
                return res.json({ status: "oops" });
            }
        } else {
            return res.json({ status: "oops" });
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
    deleteCoupon,
    BlockCoupon,
    couponUnblock
}