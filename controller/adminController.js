const User = require("../model/userModel");
const Category = require("../model/categoryModel");

//========================================= Render admin login page==============================================

const adminLogin = (req, res) => {
    try {
        res.render("admin/adminLogin");
    } catch (error) {
        console.log(error);
    }
}

//========================================= check entered email and password is valid ==============================================

const adminLoginPOST = async (req, res) => {
    try {
        const adminEmail = "sameen@gmail.com";
        const adminPassword = "000";
        const ajaxEmail = req.body.useremail;
        const ajaxPass = req.body.userpass;
        if (adminEmail === ajaxEmail) {
            if (ajaxPass === adminPassword) {
                console.log(`${ajaxEmail} Entering to home page`);
                req.session.useremail = ajaxEmail;
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
        const newCat = {
            name: Cat,
            description: Description
        }
        const alreadyName = await Category.findOne({ name: newCat.name });
        if (alreadyName) {
            console.log("Name already existed");
            res.json({ status: false })
        } else {
            const setCat = await Category.create(newCat);
            res.json({ status: true });
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= Block category ==============================================

const blockCategory = async (req, res) => {
    try {
        const categoryID = req.query._id;
        const blockProcess = await Category.updateOne({ _id: categoryID }, { isBlocked: true });
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
        const UnblockProcess = await Category.updateOne({ _id: categoryID }, { isBlocked: false });
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
        req.session.editCatDetails = editCatID;
        res.render("admin/editCategory", { catDet });
    } catch (error) {
        console.log(error);
    }
}

//========================================= Edit category details changing ==============================================

const adminEditPOST = async (req, res) => {
    try {
        const editName = req.body.name;
        const editDescription = req.body.description;
        const editProcess = await Category.updateOne({ _id: req.session.editCatDetails }, { name: editName, description: editDescription })
        console.log("edit done");
        res.json({ status: true })
    } catch (error) {
        console.log(error);
    }
}

//========================================= rendering product page ==============================================

const productPage = (req, res) => {
    try {
        res.render("admin/productPage")
    } catch (error) {
        console.log(error);
    }
}

//========================================= Add new product page rendering ==============================================

const addProduct = (req, res) => {
    try {
        res.render("admin/addProduct")
    } catch (error) {
        console.log(error);
    }
}

//========================================= Add new product post to server ==============================================

const addProductPOST = (req, res) => {
    try {
            // name,
            // description,
            // categorySelect,
            // regularPrice,
            // capacity,
            // material,
            // stock,
            // color
        const name = req.body.name;
        const description = req.body.description;
        const category = req.body.categorySelect;
        const regularPrice = parseInt(req.body.regularPrice)
        const capacity = parseInt(req.body.capacity)
        const material = req.body.material;
        const stock = parseInt(req.body.stock);
        const color = req.body.color

        if (regularPrice >= 1000) {
            if (regularPrice <= 99999) {
                if (stock >= 1) {
                    if (capacity >= 1) {
                        if (capacity <= 8) {
                            console.log(name , description , category , regularPrice , capacity , material , stock , color);
                        } else {
                            console.log("capacity cannot support more than 8");
                            res.json({ status: "capacityMax" })
                        }
                    } else {
                        console.log("capacity cannot support less than 1");
                        res.json({ status: "capacityMin" })
                    }
                } else {
                    console.log("stock cannot support less than 1");
                    res.json({ status: "stockMin" })
                }
            } else {
                console.log("regular price can not support mor than 99,999");
                res.json({ status: "regularMax" })
            }
        } else {
            console.log("regular price must need morethan 999");
            res.json({ status: "regularMin" })
        }
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
    adminEditPOST,
    productPage,
    addProduct,
    addProductPOST
}