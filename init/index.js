const mongoose = require("mongoose");
const initData = require("./datasample.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/KASUT";
mongoose.set("strictQuery", true);

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
    await Listing.deleteMany({});

    let sampleUser = await User.findOne({ username: "kasutadmin" });
    if (!sampleUser) {
        sampleUser = new User({ email: "admin@kasut.com", username: "kasutadmin" });
        sampleUser = await User.register(sampleUser, "helloworld");
    }

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: sampleUser._id
    }));

    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();