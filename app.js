const express = require("express");
const app = express();
const userRouter = require("./router/userRouter.js");
const session = require("express-session");
const database = require("./Database/database.js");
const nocache = require("nocache");

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.urlencoded({extended : true}));
app.use(session({
    secret : "Furnix@session",
    resave : false,
    saveUninitialized : true
}))


app.set('view engine' , 'ejs');
app.use('/' , userRouter);



app.use(nocache())

app.use("*",(req,res)=>{
    res.status(404).render("page-404")
});

app.use((err,req,res,next)=>{
    res.status(500).render("page-404")
})


app.listen(5000, console.log(`Server strated at 5000 port number`));