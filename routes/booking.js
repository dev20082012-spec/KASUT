const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isBookingGuest } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

router.post("/", isLoggedIn, wrapAsync(bookingController.createBooking));
router.delete("/:bookingId", isLoggedIn, isBookingGuest, wrapAsync(bookingController.cancelBooking));

module.exports = router;
