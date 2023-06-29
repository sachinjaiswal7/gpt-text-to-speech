const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.js");





// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from the session
passport.deserializeUser(async (id, done) => {
try{
   const user = await User.findById(id);
   done(null,user);
}catch(err){
    next(err);
}
  });

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.DOMAIN + "/auth/google/callback"
},  async (accessToken, refreshToken, profile, done) => {
try{
    let user = await User.findOne({email : profile._json.email})
    if(!user){
        user = await User.create({name: profile._json.name, email : profile._json.email,picture : profile._json.picture});
        done(null,user);
    }
    else{
     done(null,user);
    }
}catch(err){
    done(err);
}
  }))