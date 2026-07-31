const mongoose = require("mongoose");
const initData = require("./datasample.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/KASUT";
mongoose.set('strictQuery', true); //
main()
    .then(() => {
        console.log("server connected to Mongoose");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({}); // as before initializing the data of datasample.js file if any of the data past present then remove that...
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();