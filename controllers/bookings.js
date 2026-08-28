const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");

module.exports.createBooking = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (listing.owner.equals(req.user._id)) {
        req.flash("error", "You cannot book your own listing");
        return res.redirect(`/listings/${id}`);
    }
    let { checkIn, checkOut } = req.body.booking;
    let checkInDate = new Date(checkIn);
    let checkOutDate = new Date(checkOut);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (checkInDate < todayStart) {
        req.flash("error", "Check-in cannot be in the past");
        return res.redirect(`/listings/${id}`);
    }
    if (checkInDate >= checkOutDate) {
        req.flash("error", "Check-out must be after check-in");
        return res.redirect(`/listings/${id}`);
    }

    const existingBookings = await Booking.find({ listing: id });
    const hasConflict = existingBookings.some(b => checkInDate < b.checkOut && checkOutDate > b.checkIn);
    if (hasConflict) {
        req.flash("error", "Those dates are already booked. Please choose different dates.");
        return res.redirect(`/listings/${id}`);
    }

    const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

    const newBooking = new Booking({
        listing: listing._id,
        guest: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice
    });
    listing.bookings.push(newBooking);
    await newBooking.save();
    await listing.save();
    req.flash("success", `Booking confirmed! ${nights} night${nights !== 1 ? "s" : ""} \u00b7 \u20b9${totalPrice.toLocaleString("en-IN")}`);
    res.redirect(`/listings/${id}`);
};

module.exports.cancelBooking = async (req, res) => {
    let { id, bookingId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { bookings: bookingId } });
    await Booking.findByIdAndDelete(bookingId);
    req.flash("success", "Booking cancelled successfully");
    res.redirect("/profile");
};

module.exports.renderProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    const myListings = await Listing.find({ owner: req.user._id });
    const allMyBookings = await Booking.find({ guest: req.user._id })
        .populate("listing")
        .sort({ checkIn: 1 });
    const now = new Date();
    const upcomingBookings = allMyBookings.filter(b => b.listing && new Date(b.checkOut) >= now);
    const pastBookings = allMyBookings.filter(b => b.listing && new Date(b.checkOut) < now);
    res.render("users/profile.ejs", { user, myListings, upcomingBookings, pastBookings });
};
