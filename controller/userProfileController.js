const User = require("../model/userModel");
const Product = require("../model/productModel");
const { ObjectId } = require('mongoose').Types;
const bcrypt = require("bcrypt");

const changepassword = (req, res) => {
    try {
        res.render("userProfile/userChangePassword");
    } catch (error) {
        console.log(error);
    }
}

const changepasswordPost = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body
        const user = await User.findOne({ email: req.session.user });
        const userDBpassword = user.password
        const comparePassword = await bcrypt.compare(currentPassword, userDBpassword);
        if (comparePassword) {
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
        } else {
            res.json({ status: "currentwrong" })
        }
    } catch (error) {
        console.log()
    }
}


const accountDetails = (req, res) => {
    try {
        res.render("userProfile/userAccountDetails")
    } catch (error) {
        console.log(error);
    }
}


const addressGet = async (req, res) => {
    try {
        const userDetails = await User.findOne({ email: req.session.user });
        res.render("userProfile/userAddress", { userDetails });
    } catch (error) {
        console.log();
    }
}

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

const deleteAddress = async (req, res) => {
    try {
        const addressID = req.body.ID;
        const deleteProcess = await User.updateOne({ email: req.session.user }, { $pull: { address: { _id: addressID } } });
        if (deleteProcess.modifiedCount == 1) {
            console.log("delete done");
            res.json({ status: "deleted" });
        } else {
            console.log("not deleted somthing wrong");
            res.json({ status: "wrong" })
        }
    } catch (error) {
        console.log(error);
    }
}

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

const editAddress = async (req, res) => {
    try {
        const { name, number, address, pin, state, district, AddressType, Landmark, altNumber } = req.body;
        const addressID = req.session.editAddressID;
        const userDetails = await User.findOne({ email: req.session.user });
        const editingAddress = userDetails.address.find(elems => elems._id == addressID);
        const editedAddress = {
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
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    changepassword,
    changepasswordPost,
    accountDetails,
    addressGet,
    addressPOST,
    deleteAddress,
    editAddress,
    editAddressget
}