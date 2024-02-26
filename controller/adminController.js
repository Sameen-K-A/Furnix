const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");

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

const adminHome = async (req, res) => {
    try {
        const user = await User.find({});
        const category = await Category.find({})
        const product = await Product.find({})
        const order = await Order.find({status : "Delivered"})
        let revenue = 0;
        for(let i=0 ; i< order.length ; i++){
            revenue += order[i].total
        }
        res.render("admin/adminHome" , {user , category , product , order , revenue})
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
        const categoryID = req.body.categoryID

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
            const updateprocess = await Category.updateOne({_id : categoryID} , newCat);
            if(updateprocess.modifiedCount === 1){
                res.json({ status: true });
            } else{
                res.json({ status: "nochange" });
            }
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

//========================================= Admin logout side ==============================================

const orderget = async (req, res) => {
    try {
        const orderData = await Order.find({}).sort({_id : -1})
        res.render("admin/orderPage", { orderData })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Admin logout side ==============================================

const orderInfo = async (req, res) => {
    try {
        const id = req.query.id;
        const orderDetails = await Order.findById({ _id: id });
        res.render("admin/orderInfo", { orderDetails })
    } catch (error) {
        console.log(error);
    }
}

//========================================= Admin order status changing side ==============================================

const statusChanger = async (req, res) => {
    try {
        const newStatus = req.body.value;
        const changeOrderID = req.body.id;
        const orderData = await Order.findById({ _id: changeOrderID });
        if (orderData.status !== newStatus) {
            orderData.status = newStatus;
            orderData.save();
            if (newStatus === "Cancelled") {
                for( let i=0 ; i<orderData.product.length ; i++){
                    const product = await Product.findById({_id : orderData.product[i]._id});;
                    if(product){
                        product.stock += orderData.product[i].cartQty;
                        product.save();
                    }
                }
            }
            res.json({ status: "okay" })
        } else {
            res.json({ status: "nochange" })
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
    catEditPOST,
    adminLogout,
    orderget,
    orderInfo,
    statusChanger,
}


