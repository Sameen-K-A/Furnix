const User = require("../model/userModel");
const Category = require("../model/categoryModel");

//========================================= Render admin login page==============================================

const adminLogin = (req, res) => {
    try {
        if (req.session.admin) {
            return res.redirect("/admin/adminHome")
        }
        res.render("admin/adminLogin");
    } catch (error) {
        console.log(error);
    }
}

//========================================= check entered email and password is valid ==============================================

const adminLoginPOST = async (req, res) => {
    try {
        const adminEmail = process.env.adminEmail;
        const adminPassword = process.env.adminPassword;
        const ajaxEmail = req.body.useremail;
        const ajaxPass = req.body.userpass;
        if (adminEmail === ajaxEmail) {
            if (ajaxPass === adminPassword) {
                console.log(`${ajaxEmail} Entering to home page`);
                req.session.admin = adminEmail;
                res.json({ status: true })
            } else {
                console.log("Entered password is wrong");
                res.json({ status: "passwordwrong" })
            }
        } else {
            console.log("email not found");
            res.json({ status: "emailerror" })
        }
    } catch (error) {
    }
}

//========================================= render admin home page ==============================================

const adminHome = (req, res) => {
    try {
        res.render("admin/adminHome")
    } catch (error) {
        console.log(error);
    }
}

//========================================= render user list page ==============================================

const adminUserList = async (req, res) => {
    try {
        const UserDatas = await User.find({});
        res.render("admin/adminUserList", { UserDatas });
    } catch (error) {
        console.log(error);
    }
}

//========================================= user block area ==============================================

const userBlock = async (req, res) => {
    try {
        const blockUserEmail = req.query.email;
        await User.updateOne({ email: blockUserEmail }, { isBlocked: true });
        res.redirect("/admin/adminUserList");
    } catch (error) {
        console.log(error);
    }
}

//========================================= Blockd user unblock area ==============================================

const userUnblock = async (req, res) => {
    try {
        const UnblockUserEmail = req.query.email;
        await User.updateOne({ email: UnblockUserEmail }, { isBlocked: false });
        res.redirect("/admin/adminUserList");
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render category page ==============================================

const category = async (req, res) => {
    try {
        const catDetails = await Category.find({})
        res.render("admin/addCategory", { catDetails });
    } catch (error) {
        console.log(error);
    }
}

//========================================= Add new category ==============================================

const categoryAdd = async (req, res) => {
    try {
        const Cat = req.body.name;
        const Description = req.body.description;

        const existCatDeatils = await Category.find({});
        const names = existCatDeatils.map((elems) => elems.name);
        let unique = false;

        for (let i = 0; i < names.length; i++) {
            if (Cat.toLowerCase() === names[i].toLowerCase()) {
                console.log("Name already existed");
                unique = true
                res.json({ status: false });
                break;
            }
        }
        if (unique === false) {
            const newCat = {
                name: Cat,
                description: Description
            }
            const setCat = await Category.create(newCat);
            res.json({ status: true });
            console.log('done');
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Block category ==============================================

const blockCategory = async (req, res) => {
    try {
        const categoryID = req.query._id;
        await Category.updateOne({ _id: categoryID }, { isBlocked: true });
        console.log("Blocked is done");
        res.redirect("/admin/category")
    } catch (error) {
        console.log(error);
    }
}

//========================================= Block category ==============================================

const UnblockCategory = async (req, res) => {
    try {
        const categoryID = req.query._id;
        await Category.updateOne({ _id: categoryID }, { isBlocked: false });
        console.log("Unlocked is done");
        res.redirect("/admin/category")
    } catch (error) {
        console.log(error);
    }
}

//========================================= Edit category page rendering ==============================================

const editcategory = async (req, res) => {
    try {
        const editCatID = req.query._id;
        const catDet = await Category.findOne({ _id: editCatID });
        req.session.editCatDetails = catDet.name;
        res.render("admin/editCategory", { catDet });
    } catch (error) {
        console.log(error);
    }
}

//========================================= Edit category details changing ==============================================

const catEditPOST = async (req, res) => {
    try {
        const editName = req.body.name
        const editDescription = req.body.description;

        const existCatDeatils = await Category.find({});
        const names = existCatDeatils.map((elems) => elems.name);
        let unique = false;

        for (let i = 0; i < names.length; i++) {
            if (editName.toLowerCase() === names[i].toLowerCase()) {
                console.log("Name already existed");
                unique = true
                break;
            }
        }
        if (editName === req.session.editCatDetails) {
            unique = false
        }
        if (unique === true) {
            res.json({ status: false })
        } else {
            const newCat = {
                name: editName,
                description: editDescription
            }
            await Category.create(newCat);
            res.json({ status: true });
            console.log('done');
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Admin logout side ==============================================

const adminLogout = (req, res) => {
    try {
        delete req.session.admin;
        res.redirect("/admin")
    } catch (error) {
        console.log(error);
    }
}

//========================================= Export all modules ==============================================

module.exports = {
    adminLogin,
    adminLoginPOST,
    adminHome,
    adminUserList,
    userBlock,
    userUnblock,
    category,
    categoryAdd,
    blockCategory,
    UnblockCategory,
    editcategory,
    catEditPOST,
    adminLogout
}


