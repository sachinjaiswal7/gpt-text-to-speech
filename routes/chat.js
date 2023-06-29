const express = require("express");
const {pingChatGpt} = require("../controllers/chat.js")
const CustomError = require("../utils/CustomError.js");
const User = require("../models/user.js");



const router = express.Router();


router.get("/chat",(req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }
    else{
        next(new CustomError(`please login first have chat with our AI`))
    }
},pingChatGpt);


//actual frontend chatting route 
router.get("/chatting",async (req,res,next) => {
try{
    if(!req.isAuthenticated()){
        return next(new CustomError("Login first to access this route"));
    }
    const user = await User.findById(req.user._id);
    const conversation = user.conversation;
    const sound = user.sound
    const picture = user.picture;
    const name = user.name
    res.render("chatpage.ejs",{conversation,sound,picture,name});
}catch(err){
    next(err);
}

})

module.exports = router;
