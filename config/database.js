const mongoose = require("mongoose");

exports.connectDb = () => {
 mongoose.connect(process.env.DB_URI).then(() => {
    console.log("database connected ");
 }).catch((err) => {
    console.log("couldn't connect to the database");
    next(err);
 })
}