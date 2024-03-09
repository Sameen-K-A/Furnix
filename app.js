const express = require("express");
const app = express();
const userRouter = require("./router/userRouter.js");
const adminRouter = require("./router/adminRouter.js");
const session = require("express-session");
const connectDB = require("./Database/database.js");
const nocache = require("nocache");
const path = require("path")
const dotenv = require("dotenv")
dotenv.config();
connectDB()


app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.static("uploads"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());


app.use(session({
    secret : "Furnix@session",
    resave : false,
    saveUninitialized : true
}))

app.use(nocache())
app.use("/static" ,express.static(path.join(__dirname, "public")));
app.set('view engine' , 'ejs');
app.use("/admin" , adminRouter);
app.use('/' , userRouter);


app.use("*",(req,res)=>{
    res.status(404).render("user/page-404")
});
app.use((req, res, next) => {
    if (req.method === 'GET') {
        delete req.session.categorySearch
        console.log("hello");
    }
    next();
});


app.listen(process.env.PORT, console.log(`Server started at ${process.env.PORT} number`));