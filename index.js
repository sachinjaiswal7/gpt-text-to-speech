const app = require("./app.js");

const {connectDb} = require("./config/database.js");
const PORT = process.env.PORT;


//database connection done 
connectDb();


app.listen(PORT , () => {
    console.log(`Listening on the port ${PORT}`)
})