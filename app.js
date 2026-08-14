const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema_joi.js");
const Review = require("./models/reviews.js");

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
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public"))); // rhe static file that doesnt change for anything on the browser done by user and their required and path...


app.get("/", (req, res) => {
    res.send("url is working out");
});


const validateListings = (req, res, next) => { // middleware
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMess = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMess);
    }
    else next();
}


// INDEX ROUTE...
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// CREATE ROUTE AFTER THE NEW ROUTE ATTACH TO IT...
app.post("/listings", validateListings,
    wrapAsync(async (req, res, next) => {
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

        // JOI REPLACES ALL THIS EXCESS WRITING...
        // if(!req.body.listing) throw new ExpressError(400, "invalid data");
        // if(!newListing.title) throw new ExpressError(400, " title is required");
        // if(!newListing.description) throw new ExpressError(400, " description is required");
        // if(!newListing.price) throw new ExpressError(400, " price is required"); 
        // if(!newListing.country) throw new ExpressError(400, " country is required");
        // if(!newListing.location) throw new ExpressError(400, " location is required");


        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }));

//EDIT ROUTE...
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));


// UPDATE ROUTE
app.put("/listings/:id", validateListings, wrapAsync(async (req, res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "invalid data");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// SHOW ROUTE 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// DELETE ROUTE...
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Reviews - post route
app.post("/listings/:id/reviews", async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
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

app.all("/{*path}", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/Error.ejs", { err });
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("server is running");
});