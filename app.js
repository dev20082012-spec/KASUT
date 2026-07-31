const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public"))); // rhe static file that doesnt change for anything on the browser done by user and their required and path...


app.get("/", (req, res) => {
    res.send("url is working out");
});

// INDEX ROUTE...
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

// NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// CREATE ROUTE AFTER THE NEW ROUTE ATTACH TO IT...
app.post("/listings", async (req, res) => {
    // let { title, description, image, price, country, location } = req.body; // this thing is used to send req to the server...
    // const listing = new Listing({
    //     title: title,
    //     description: description,
    //     image: image,
    //     price: price,
    //     country: country,
    //     location: location,
    // });
    // await listing.save();
    // res.redirect("/listings");\

    // new syntax cuz change in ejs as listing[]...
    // let listing = req.body.listing;

    // another short index...
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//EDIT ROUTE...
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});


// UPDATE ROUTE
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

// SHOW ROUTE 
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

// DELETE ROUTE...
app.delete("/listings/:id",async (req, res) => {
    let {id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "my first hotel",
//         description: "a very good hotel with all the ammenities",
//         price: 1200,
//         location: "goa",
//         country: "india"
//     });

//    await sampleListing.save();

//    console.log("sample was saved");
//    res.send("succesful");
// });

app.listen(8080, () => {
    console.log("server is running");
});