const User = require("../model/userModel");
const Product = require("../model/productModel");
const bcrypt = require("bcrypt");

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
        const { name, number, selectedDateOfBirth } = req.body;
        const data = {
            name: name,
            phone: number,
            DateOfBirth: selectedDateOfBirth
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
    editdetailspost
}