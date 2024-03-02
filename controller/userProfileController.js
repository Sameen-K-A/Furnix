const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const Coupon = require("../model/coupenModel");
const date = require("../config/dateGenerator");
//========================================= inside user profile page change password session rendering ==============================================

const changepassword = (req, res) => {
    try {
        res.render("userProfile/userChangePassword");
    } catch (error) {
        console.log(error);
    }
}

//========================================= Password updating area ==============================================

const changepasswordPost = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body
        const user = await User.findOne({ email: req.session.user });
        const userDBpassword = user.password
        const comparePassword = await bcrypt.compare(currentPassword, userDBpassword);
        if (comparePassword) {

            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(newPassword)){
                if (newPassword.length >= 8) {
                    if (newPassword === confirmPassword) {
                        const hashPassword = await bcrypt.hash(newPassword, 10);
                        await User.updateOne({ email: req.session.user }, { password: hashPassword });
                        res.json({ status: true })
                    } else {
                        res.json({ status: "bothpasswrong" })
                    }
                } else {
                    res.json({ status: "newpasslength" })
                }
            } else{
                res.json({ status: "newpassstrength" });
            }


            
        } else {
            res.json({ status: "currentwrong" })
        }
    } catch (error) {
        console.log()
    }
}

//========================================= Render user account details  ==============================================

const accountDetails = async (req, res) => {
    try {
        const userDetails = await User.findOne({ email: req.session.user })
        res.render("userProfile/userAccountDetails", { userDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= editing user details page rendering ==============================================

const editdetails = async (req, res) => {
    try {
        const userDetails = await User.findOne({ email: req.session.user });
        res.render("userProfile/editAccountDetails", { userDetails });
    } catch (error) {
        console.log(error);
    }
}

//========================================= Update user details editing area==============================================

const editdetailspost = async (req, res) => {
    try {
        const { name, number } = req.body;
        const data = {
            name: name,
            phone: number
        }
        const updateProcess = await User.updateOne({ email: req.session.user }, data);
        if (updateProcess.matchedCount === 1 && updateProcess.modifiedCount == 1) {
            res.json({ status: "success" })
        } else if (updateProcess.matchedCount === 1 && updateProcess.modifiedCount == 0) {
            res.json({ status: "nochange" })
        } else {
            res.json({ status: "wrong" })
        }
    } catch (error) {

    }
}

//========================================= Render user address page ==============================================

const addressGet = async (req, res) => {
    try {
        const userDetails = await User.findOne({ email: req.session.user });
        res.render("userProfile/userAddress", { userDetails });
    } catch (error) {
        console.log();
    }
}

//========================================= Adding new user address ==============================================

const addressPOST = async (req, res) => {
    try {
        const { name, number, address, pin, state, district, AddressType, Landmark, altNumber } = req.body;
        const addressData = {
            name: name,
            number: number,
            address: address,
            pin: pin,
            district: district,
            state: state,
            addressType: AddressType,
            landmark: Landmark,
            alternateNumber: altNumber
        }
        const email = req.session.user;
        const updateProcess = await User.updateOne({ email: email }, { $push: { address: addressData } });
        if (updateProcess.modifiedCount === 1) {
            res.json({ status: "success" })
        } else {
            res.json({ status: "wrong" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Delete user address side ==============================================

const deleteAddress = async (req, res) => {
    try {
        const addressID = req.body.ID;
        const deleteProcess = await User.updateOne({ email: req.session.user }, { $pull: { address: { _id: addressID } } });
        if (deleteProcess.modifiedCount == 1) {
            res.json({ status: "deleted" });
        } else {
            res.json({ status: "wrong" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Editing user address area ==============================================

const editAddressget = async (req, res) => {
    try {
        const addressID = req.query.id;
        req.session.editAddressID = addressID;
        const userDetails = await User.findOne({ email: req.session.user });
        const editingAddress = userDetails.address.find(elems => elems._id == addressID)
        res.render("userProfile/editAddress", { editingAddress });
    } catch (error) {
        console.log(error);
    }
}

//========================================= Update edited address area ==============================================

const editAddress = async (req, res) => {
    try {
        const { name, number, address, pin, state, district, AddressType, Landmark, altNumber } = req.body;
        const address_id = req.session.editAddressID;
        const updateProcess = await User.findOneAndUpdate({ email: req.session.user, 'address._id': address_id },
            {
                $set: {
                    'address.$.name': name,
                    'address.$.number': number,
                    'address.$.address': address,
                    'address.$.pin': pin,
                    'address.$.district': district,
                    'address.$.state': state,
                    'address.$.addressType': AddressType,
                    'address.$.landmark': Landmark,
                    'address.$.alternateNumber': altNumber
                }
            });
        if (updateProcess) {
            res.json({ status: "success" })
        } else {
            res.status({ status: "wrong" })
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render user profile order page ==============================================

const orders = async (req, res) => {
    try {
        const orderData = await Order.find({ userEmail: req.session.user }).sort({_id : -1})
        res.render("userProfile/userOrders", { orderData })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render separate order info page ==============================================

const vieworderinfo = async (req, res) => {
    try {
        const orderID = req.query.id;
        const orderInfodata = await Order.findOne({ _id: orderID });
        res.render("userProfile/orderInfo", { orderInfodata })
    } catch (error) {
        console.log(error);
    }
}

//========================================= user cancel order ==============================================

const cancelOrder = async (req, res) => {
    try {
        const cancelID = req.body.id;
        const cancelProcess = await Order.updateOne({ _id: cancelID }, { status: "Cancelled" });
        if (cancelProcess.modifiedCount === 1) {
            const cancelProducts = await Order.findOne({ _id: cancelID });
             // recover coupon
             const usedCoupon = await Coupon.findOne({coupencode : cancelProducts.couponCode});
            await User.updateOne({email : req.session.user} , {$push : {coupens : usedCoupon._id.toString()}});
            // product quantity push back
            for (let j = 0; j < cancelProducts.product.length; j++) {
                const cancelProduct = cancelProducts.product[j];
                const product = await Product.findById(cancelProduct._id);
                if (product) {
                    product.stock += cancelProduct.cartQty;
                    await product.save();
                }
            }
            res.json({ status: "okay" });
        } else {
            res.json({ status: "oops" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
    }
}

//========================================= user cancel order ==============================================

const cancelreturnOrder = async (req, res) => {
    try {
        const cancelID = req.body.id;
        const cancelProcess = await Order.updateOne({ _id: cancelID }, { status: "Return order cancel" });
        if (cancelProcess.modifiedCount === 1) {
            res.json({ status: "okay" });
        } else {
            res.json({ status: "oops" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
    }
}


//========================================= user cancel order ==============================================

const returnorder = async (req, res) => {
    try {
        const returnID = req.body.id;
        const orderDetails = await Order.updateOne({_id : returnID} , {status : "Return order processing"});
        if(orderDetails.modifiedCount === 1){
            res.json({status : "okay"})
        } else{
            res.json({status : "oops"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
    }
}

//========================================= coupons page render  ==============================================

const coupons = async (req, res) => {
    try {
        const userData = await User.findOne({email : req.session.user});
        const orginalCoupons = await Coupon.find({}).sort({_id : -1});
        const currentDate = new Date(date());
        const userCoupons = [];
        for (let i = 0; i < userData.coupens.length; i++) {
            for(let j=0 ; j<orginalCoupons.length ; j++){
                if(userData.coupens[i] === orginalCoupons[j]._id.toString()){
                    userCoupons.push(orginalCoupons[j])
                    break;
                }
            }
        }
        res.render("userProfile/userCoupon" , {userData , userCoupons})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Exporting all modules ==============================================

module.exports = {
    changepassword,
    changepasswordPost,
    accountDetails,
    editdetails,
    addressGet,
    addressPOST,
    deleteAddress,
    editAddress,
    editAddressget,
    editdetailspost,
    orders,
    vieworderinfo,
    cancelOrder,
    returnorder,
    cancelreturnOrder,
    coupons
}