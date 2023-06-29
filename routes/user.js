const express = require("express");
const CustomError = require("../utils/CustomError.js");
const path = require("path");

const router = express.Router();

router.get("/dashboard",async(req,res,next) => {
    if(req.isAuthenticated()){
      res.status(200).json({
        success : true,
        user : req.user
      })
    }
    else{
        return next(new CustomError("Login first to see this page"));
    }
   
});

router.get("/logout",async(req,res,next) => {
try{
    console.log("came in");
    if(!req.isAuthenticated()){
        return next(new CustomError("Login first to logout",400));
    }
    else{
        req.logout();
        res.redirect(process.env.DOMAIN);
    }
}catch(err){
    next(err);
}
})


module.exports = router;