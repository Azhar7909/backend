const mongoose = require("mongoose");

const mdb = process.env.DB_CON_STRING;

mongoose.set("strictQuery",false);
mongoose.connect(mdb).then(() => {
    console.log("Mongodb is connected successfully!");
}).catch((err) => {
    console.log("mongodb connection failed >>>>",err);
})