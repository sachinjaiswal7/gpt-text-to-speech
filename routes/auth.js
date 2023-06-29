const express = require("express");
const passport = require("passport");


const router = express.Router();


router.get("/google",passport.authenticate("google",{
    scope : ["profile","email"]
}))

router.get("/google/callback",passport.authenticate("google"),(req, res, next) => {
    res.redirect(process.env.DOMAIN+"/api/v1/chatting");
})







module.exports = router;