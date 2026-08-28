const mongoose = require("mongoose");
const Review = require("./reviews.js");
const Booking = require("./booking.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v
        }
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: ["Beaches", "Mountains", "Castles", "Farms", "Arctic", "Camping", "Iconic Cities", "Treehouses", "Lakefront", "Desert", "Luxury", "Tropical"]
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: "Booking"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
        await Booking.deleteMany({ _id: { $in: listing.bookings } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;