const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const Coupon = require("../model/coupenModel");
const Wallet = require("../model/walletModel")
const date = require("../config/dateGenerator");
const id = require("../config/randomID");
const color = require("../config/colorGenerator");
const exceljs = require("exceljs");

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
        const order = await Order.find({status: { $nin: ["Ordered", "Shipped", "Cancelled"]}})
        let revenue = 0;
        for(let i=0 ; i< order.length ; i++){
            revenue += order[i].total
        }
        // line chart user line
        const UserdayArray = [0,0,0,0,0,0,0];
        for (let i = 0; i < user.length; i++) {
            let createddate = new Date(user[i].createdOn);
            createddate = createddate.getDay();
            UserdayArray[createddate] += 1;
        };
        // line chart order counting each day
        const orderData = await Order.find({});
        const orderdayArray = [0,0,0,0,0,0,0];
        for (let i = 0; i < orderData.length; i++) {
            let dateOfOrder = new Date(orderData[i].date);
            dateOfOrder = dateOfOrder.getDay();
            orderdayArray[dateOfOrder] += 1
        };
        // Bar chart weekly revenew
        const revenewDayaArray = [0,0,0,0,0,0,0];
        for (let i = 0; i < orderData.length; i++) {
            if(orderData[i].paymentMethod === "Cash on delivery"){
                if(orderData[i].status === "Delivered" || orderData[i].status === "Return order processing" || orderData[i].status === "Return order cancel"){
                    let dateOfOrder = new Date(orderData[i].date);
                    dateOfOrder = dateOfOrder.getDay();
                    revenewDayaArray[dateOfOrder] += orderData[i].total;
                }
            }
            if(orderData[i].paymentMethod === "Razorpay"){
                if(!orderData[i].status === "Cancelled" || !orderData[i].status === "Return order recieved"){
                    let dateOfOrder = new Date(orderData[i].date);
                    dateOfOrder = dateOfOrder.getDay();
                    revenewDayaArray[dateOfOrder] += orderData[i].total;
                }
            }
        }

        // top 5 products
        const productCounts = await Order.aggregate([
            { $unwind: "$product" },{ $group: { _id: "$product.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } }, { $limit: 5 },{ $project: { _id: 0, product: "$_id" } }
        ]);
        const productList = productCounts.map(item => item.product);
        const top5products = await Product.find({ name: { $in: productList } });

        // top 5 category
        const productCategoryCounts = await Order.aggregate([
            { $unwind: "$product" },
            { $group: { _id: "$product.categoryName", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, category: "$_id", count: 1 } }
        ]);
        let productcatList = productCategoryCounts.map(item => item.category);
        for (const categoryItem of category) {
            if (productcatList.length >= 5) break;
            if (!productcatList.includes(categoryItem.name)) {
                productcatList.push(categoryItem.name);
            }
        }

        
        res.render("admin/adminHome" , {user , category , product , order , revenue , UserdayArray , orderdayArray , revenewDayaArray , top5products , productcatList})
    } catch (error) {
        console.log(error);
    }
}

//========================================= Product counts based on category sales caht details send through ajax ==============================================

const CatChart = async (req, res) => {
    try {
        const category = await Category.find({});
        const catNames = category.map(cat => cat.name);
        const allOrders = await Order.aggregate([
            { $unwind: "$product" },
            { $group: { _id: "$product.categoryName", cartQty: { $sum: { $toInt: "$product.cartQty" } } } }
        ]);
        const cartQtyArray = catNames.map(catName => {
            const order = allOrders.find(order => order._id === catName);
            return order ? order.cartQty : 0;
        });
        chartColores = color(category.length);
        res.json({status : "true" , catNames : catNames , chartColores: chartColores , cartQtyArray : cartQtyArray})
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
        // checking active category is expaired or not
        const activeCat = await Category.find({catOfferStatus : "Active"});
        if(activeCat.length !=0){
            const currentDate = new Date(date());
            for (let i = 0; i < activeCat.length; i++) {
                const endingDate = new Date(activeCat[i].OfferEndDate) ;
                if(currentDate > endingDate){
                    activeCat[i].catOfferStatus = "Expaired";
                    const products = await Product.find({categoryID : activeCat[i]._id , regularPrice : {$gt : activeCat[i].OfferStartingPrice}});
                    if(products.length != 0){
                        for (let j = 0; j < products.length; j++) {
                            products[j].offerPrice = products[j].regularPrice;
                            products[j].offerPercentage = 0;
                            await products[j].save()
                        }
                    }
                    await activeCat[i].save()
                }
                // checking aall products is got offer;
                const products = await Product.find({categoryID : activeCat[i]._id , regularPrice : {$gt : activeCat[i].OfferStartingPrice}});
                if(products.length != 0){
                    for (let j = 0; j < products.length; j++) {
                        if(products[j].offerPrice !== products[j].regularPrice - activeCat[i].OfferDiscount){
                            products[j].offerPrice = products[j].regularPrice - activeCat[i].OfferDiscount;
                            products[j].offerPercentage = Math.round(((products[j].regularPrice - products[j].offerPrice) / products[j].regularPrice) * 100);
                            await products[j].save()
                        }
                    }
                }
            }
        }
        // checking awaiting category offer time is ready for active;
        const AwaitingCat = await Category.find({catOfferStatus : "Awaiting"});
        if(AwaitingCat.length !=0){
            const currentDate = date();
            for (let i = 0; i < AwaitingCat.length; i++) {
                const startDate = AwaitingCat[i].OfferStartDate;
                if(currentDate === startDate){
                    AwaitingCat[i].catOfferStatus = "Active";
                    const products = await Product.find({categoryID : AwaitingCat[i]._id , regularPrice : {$gt : AwaitingCat[i].OfferStartingPrice}});
                    if(products.length != 0){
                        for (let j = 0; j < products.length; j++) {
                            products[j].offerPrice = products[j].regularPrice - AwaitingCat[i].OfferDiscount;
                            products[j].offerPercentage = Math.round(((products[j].regularPrice - products[j].offerPrice) / products[j].regularPrice) * 100);
                            await products[j].save()
                        }
                    }
                    await AwaitingCat[i].save()
                }
            }
        }
        // render category page
        const catDetails = await Category.find({})
        res.render("admin/addCategory", { catDetails });
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render categoryoffer page ==============================================

const categoryoffer = async (req, res) => {
    try {
        const catDetails = await Category.find({});
        res.render("admin/categoryoffer" , { catDetails });
    } catch (error) {
        console.log(error);
    }
}

//========================================= Render categoryoffer edit page ==============================================

const editcategoryoffer = async (req, res) => {
    try {
        const catID = req.query.id;
        const findCat = await Category.findOne({_id : catID});
        res.render("admin/editCategoryOffer" , {findCat})
    } catch (error) {
        console.log(error);
    }
}

//========================================= categoryoffer edit patch details ==============================================

const editcategoryofferPatch = async (req, res) => {
    try {
        const catName = req.body.name;
        let offer_StartingDate = req.body.startingDate;
            offer_StartingDate = offer_StartingDate.replace(/-/g, '/');
        let offer_EndingDate = req.body.endingDate;
            offer_EndingDate = offer_EndingDate.replace(/-/g, '/');
        const offer_startPrice = parseInt(req.body.minimumAmount);
        const offer_Amount = parseInt(req.body.discountamount);
        const currentDate = date();
        let catOfferStatus = false;
        if (offer_StartingDate === currentDate) {
            catOfferStatus = "Active"
        }else{
            catOfferStatus  = "Awaiting"
        }

        const newCouponData = {
            OfferStartDate : offer_StartingDate,
            OfferEndDate : offer_EndingDate,
            OfferDiscount : offer_Amount,
            OfferStartingPrice : offer_startPrice,
            createDate : new Date(),
            catOfferStatus : catOfferStatus
        }
        // new offer updating process
        const updateProcess = await Category.updateOne({name : catName} , newCouponData);
        if(updateProcess.modifiedCount !=0){
            const findingcategory = await Category.findOne({name : catName});
            const products = await Product.find({categoryID : findingcategory._id , regularPrice : {$gt : offer_startPrice}});
            if(products.length != 0){
                if(catOfferStatus === "Active"){
                for (let i = 0; i < products.length; i++) {
                    products[i].offerPrice = products[i].regularPrice - offer_Amount;
                    products[i].offerPercentage = Math.round(((products[i].regularPrice - products[i].offerPrice) / products[i].regularPrice) * 100);
                    await products[i].save()
                }
            }
            res.json({status : "okay"})
        } else{
            res.json({status : "okay"})
        }
        } else{
            res.json({status : "oops"})
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= categoryoffer edit patch details ==============================================

const Deletecategoryoffer = async (req, res) => {
    try {
        const catID = req.body.id;
        const catDetails = await Category.findOne({_id : catID});
        const products = await Product.find({categoryID : catDetails._id , regularPrice : {$gt : catDetails.OfferStartingPrice}});
        const changeData = {
            OfferStartDate : false,
            OfferEndDate : false,
            OfferDiscount : false,
            OfferStartingPrice : false,
            createDate : false,
            catOfferStatus : false
        }
        const updateProcess = await Category.updateOne({_id : catID} , changeData);
        if(updateProcess.modifiedCount !=0){
            if(products.length != 0 && catDetails.catOfferStatus === "Active"){
                for (let i = 0; i < products.length; i++) {
                    products[i].offerPrice = products[i].regularPrice;
                    products[i].offerPercentage = 0;
                    await products[i].save()
                }
                res.json({status : "okay"})
            } else{
                res.json({status : "okay"})
            }
        } else{
            res.json({status : "oops"})
        }
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
            if(newStatus === "Delivered"){
                currentDate = date();
                const dateTime = currentDate;
                orderData.deliveredDateTime = dateTime;
            }
            orderData.status = newStatus;
            orderData.save();
            if (newStatus === "Cancelled" || newStatus === "Returned order recieved") {
                 // recover coupon
                const usedCoupon = await Coupon.findOne({coupencode : orderData.couponCode});
                if(usedCoupon != null){
                    const user = await User.findOne({email : orderData.userEmail})
                    await Coupon.updateOne({ coupencode: orderData.couponCode },{$push: { availableUsers: user._id.toString() }, $pull: { redeemedUsers: user._id.toString() }});
                }
                // product stock reassign
                for( let i=0 ; i<orderData.product.length ; i++){
                    const product = await Product.findById({_id : orderData.product[i]._id});;
                    if(product){
                        const quantity = parseInt(orderData.product[i].cartQty);
                        product.stock += quantity;
                        await product.save();
                    }
                }
                // if payment methos is online payment the amount will give back into user wallet
                if(orderData.paymentMethod === "Razorpay"){
                    const cancelUser = await User.findOne({email : orderData.userEmail});
                    const userWallet = await Wallet.findOne({userID : cancelUser._id});
                    let status;
                    if(newStatus === "Cancelled"){
                        status = "Order cancel"
                    }else{
                        status = "Order returned"
                    }
                    if(userWallet){
                        const newTransaction = {
                            transactionID : "Furnix" + id(),
                            amount : orderData.total,
                            date : date(),
                            status : status
                        }
                        userWallet.transactions.push(newTransaction);
                        userWallet.walletAmount += orderData.total;
                        userWallet.save();
                    } else{
                        const newData = {
                            userID : cancelUser._id,
                            walletAmount : orderData.total,
                            transactions : {
                                transactionID : "Furnix" + id(),
                                amount : orderData.total,
                                date : date(),
                                status : status
                            }
                        };
                        await Wallet.create(newData);
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

//========================================= Sales report page rendering ==============================================

const salesreport = async (req , res) => {
    try {
        const customValue = req.query.value;
        // all delivered orderes
        if(customValue === undefined || customValue === "All"){
            const deliveredOrders = await Order.find({status: "Delivered"})
            res.render("admin/salesreport" , {deliveredOrders , customValue})
        
        // today delivered orderes
        }else if(customValue === "Today"){
            const currentDate = date()
            const deliveredOrders = await Order.find({ status: "Delivered", deliveredDateTime : {$regex : currentDate}})
            res.render("admin/salesreport" , {deliveredOrders , customValue})

        // this Month delivered orders
        } else if(customValue === "Month"){
            const currentDate = date()
            const currentMonth = currentDate.split('/')[1];
            const deliveredOrders = await Order.find({status: "Delivered",deliveredDateTime: { $regex: `\/${currentMonth}\/` }});
            res.render("admin/salesreport" , {deliveredOrders , customValue})

        // this year delivered orders
        } else if(customValue === "Year"){
            const currentDate = date()
            const currentYear = currentDate.split('/')[0];
            const deliveredOrders = await Order.find({status: "Delivered",deliveredDateTime: { $regex: `${currentYear}` }});
            res.render("admin/salesreport" , {deliveredOrders , customValue})

        // this year delivered orders
        }  else{
            let customDate = customValue.replace(/-/g, '/');
            const deliveredOrders = await Order.find({status: "Delivered",deliveredDateTime: { $regex: customDate }});
            res.render("admin/salesreport" , {deliveredOrders , customValue})
        }
    } catch (error) {
        console.log(error);
    }
}

//========================================= download excel file ==============================================

const excelDownload = async (req, res)=>{
    try {
        const ExcelData = req.body.salesDataArray;

        const workBook = new exceljs.Workbook();
        const workSheet = workBook.addWorksheet("Sales report");

        workSheet.columns = [
            { header: "ORDER ID", key: "orderid", width: 25 }, 
            { header: "Customer Email", key: "email", width: 40 }, 
            { header: "Total Price", key: "total", width: 20 }, 
            { header: "Delivered Date", key: "date", width: 30 }, 
            { header: "Coupon code", key: "couponcode", width: 20 }, 
            { header: "Coupon discount", key: "coupondiscount", width: 20 }, 
            { header: "Payment Method", key: "paymentMethod", width: 30 }, 
        ]

        ExcelData.forEach(data => { 
            workSheet.addRow({
                orderid : data.orderID,
                email : data.customerEmail,
                total : data.total,
                date : data.deliveredDate,
                couponcode : data.couponcode,
                coupondiscount : data.coupondiscount,
                paymentMethod : data.paymentMethod
            }); 
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=salesReport.xlsx`);

        await workBook.xlsx.write(res);


    } catch (error) {
        console.log(error);
    }
}
//========================================= Export all modules ==============================================

module.exports = {
    adminLogin,
    adminLoginPOST,
    adminHome,
    CatChart,
    adminUserList,
    userBlock,
    userUnblock,
    category,
    Deletecategoryoffer,
    categoryoffer,
    editcategoryoffer,
    editcategoryofferPatch,
    categoryAdd,
    blockCategory,
    UnblockCategory,
    editcategory,
    catEditPOST,
    adminLogout,
    orderget,
    orderInfo,
    statusChanger,
    salesreport,
    excelDownload,
}


