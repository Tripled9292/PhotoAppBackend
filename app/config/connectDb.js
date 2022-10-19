const mongoose = require("mongoose");
require('dotenv').config()
const Db=process.env.DATABASE
// console.log("database=>",Db)
mongoose.connect(Db, {
    useNewUrlParser: true,
    useUnifiedTopology : true
}).then(() => {
    console.log("Connection Successful")
}).catch(( error) => {
    console.trace('Inside Catch => ', error);
})