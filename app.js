const express =  require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const cookieSession = require("cookie-session");

//importing routes 
const authRouter = require("./routes/auth.js");
const userRouter = require("./routes/user.js");
const chatRouter = require("./routes/chat.js");

dotenv.config()

require("./passport/passport.js");

//app
const app = express();


//middlewares
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static("public"))


//these three are for cookie and passport 
app.use(cookieSession({
    name : "token",
    keys : [process.env.TOKEN_CODE],
    maxAge : 24 * 60 * 60* 1000
}))

app.use(passport.initialize());
app.use(passport.session());


console.log(__dirname);

app.get("/",(req,res,next) => {
    res.render("login.ejs");
})

//using routes 

app.use("/auth",authRouter);
app.use("/api/v1",userRouter);
app.use("/api/v1",chatRouter);


app.post('/soundcheck',async(req,res,next) => {

})


//code for handling error through next
app.use((err,req,res,next) =>{
    let message = err.message;
    let statusCode = err.statusCode;
    if(!message || message == "")message = "Internal Server Error";
    if(!statusCode)statusCode = 500;
    console.log(err);
    res.status(statusCode).json({
        success : false,
        message
    })
})
module.exports = app;
