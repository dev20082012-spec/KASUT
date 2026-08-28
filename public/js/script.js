(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()

let taxSwitch = document.getElementById("taxSwitch");
if (taxSwitch) {
    taxSwitch.addEventListener("change", () => {
        let taxInfos = document.querySelectorAll(".tax-info");
        taxInfos.forEach((info) => {
            info.style.display = taxSwitch.checked ? "inline" : "none";
        });
    });
}

let ratingRange = document.getElementById("ratingRange");
let ratingValue = document.getElementById("ratingValue");
if (ratingRange && ratingValue) {
    ratingRange.addEventListener("input", () => {
        ratingValue.innerText = ratingRange.value;
    });
}

const starPicker = document.getElementById("starPicker");
const ratingInput = document.getElementById("ratingInput");
const ratingLabel = document.getElementById("ratingLabel");
const ratingLabels = ["Terrible", "Poor", "Average", "Good", "Amazing"];

if (starPicker && ratingInput) {
    const stars = starPicker.querySelectorAll(".star-pick");
    let selectedVal = 0;

    stars.forEach(star => {
        star.addEventListener("mouseover", () => {
            const val = parseInt(star.dataset.val);
            stars.forEach(s => {
                const sv = parseInt(s.dataset.val);
                s.classList.toggle("hovered", sv <= val);
                s.classList.remove("fa-solid");
                s.classList.add(sv <= val ? "fa-solid" : "fa-regular");
            });
        });

        star.addEventListener("mouseout", () => {
            stars.forEach(s => {
                const sv = parseInt(s.dataset.val);
                s.classList.remove("hovered");
                if (selectedVal === 0) {
                    s.classList.remove("fa-solid");
                    s.classList.add("fa-regular");
                } else {
                    s.classList.toggle("fa-solid", sv <= selectedVal);
                    s.classList.toggle("fa-regular", sv > selectedVal);
                }
            });
        });

        star.addEventListener("click", () => {
            selectedVal = parseInt(star.dataset.val);
            ratingInput.value = selectedVal;
            if (ratingLabel) ratingLabel.textContent = ratingLabels[selectedVal - 1];
            stars.forEach(s => {
                const sv = parseInt(s.dataset.val);
                s.classList.toggle("selected", sv <= selectedVal);
                s.classList.toggle("fa-solid", sv <= selectedVal);
                s.classList.toggle("fa-regular", sv > selectedVal);
            });
        });
    });

    const reviewForm = starPicker.closest("form");
    if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
            if (!ratingInput.value) {
                e.preventDefault();
                e.stopPropagation();
                if (ratingLabel) {
                    ratingLabel.textContent = "Please select a rating";
                    ratingLabel.style.color = "#dc3545";
                }
            }
        });
    }
}

const listingDataEl = document.getElementById("listingData");
if (listingDataEl) {
    try {
        const parsedListingData = JSON.parse(listingDataEl.textContent);
        window.__bookedRanges = parsedListingData.bookedRanges || [];
        window.__listingPrice = parsedListingData.price || 0;
    } catch (e) {
        window.__bookedRanges = window.__bookedRanges || [];
        window.__listingPrice = window.__listingPrice || 0;
    }
}

const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const bookingTotalDiv = document.getElementById("bookingTotal");
const nightsLabel = document.getElementById("nightsLabel");
const totalPriceLabel = document.getElementById("totalPriceLabel");

if (checkInInput && checkOutInput) {
    const today = new Date().toISOString().split("T")[0];
    checkInInput.min = today;
    checkOutInput.min = today;

    checkInInput.addEventListener("change", () => {
        if (checkInInput.value) {
            const nextDay = new Date(checkInInput.value);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.min = nextDay.toISOString().split("T")[0];
            if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
                checkOutInput.value = "";
            }
        }
        updateBookingTotal();
    });

    checkOutInput.addEventListener("change", updateBookingTotal);

    function updateBookingTotal() {
        if (checkInInput.value && checkOutInput.value) {
            const cin = new Date(checkInInput.value);
            const cout = new Date(checkOutInput.value);
            const nights = Math.round((cout - cin) / (1000 * 60 * 60 * 24));
            const price = window.__listingPrice || 0;
            if (nights > 0 && bookingTotalDiv) {
                const total = nights * price;
                nightsLabel.textContent = nights + " night" + (nights !== 1 ? "s" : "");
                totalPriceLabel.textContent = "\u20b9" + total.toLocaleString("en-IN");
                bookingTotalDiv.style.display = "flex";
            }
        } else if (bookingTotalDiv) {
            bookingTotalDiv.style.display = "none";
        }
    }

    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            const ranges = window.__bookedRanges || [];
            if (!ranges.length) return;
            const cin = new Date(checkInInput.value);
            const cout = new Date(checkOutInput.value);
            const hasConflict = ranges.some(r => cin < new Date(r.checkOut) && cout > new Date(r.checkIn));
            if (hasConflict) {
                e.preventDefault();
                alert("Those dates overlap with an existing booking. Please choose different dates.");
            }
        });
    }
}

function switchTab(tab, event) {
    document.querySelectorAll(".tab-content").forEach(t => t.style.display = "none");
    document.querySelectorAll(".profile-tab").forEach(t => t.classList.remove("active"));
    document.getElementById("tab-" + tab).style.display = "block";
    event.currentTarget.classList.add("active");
}

function toggleFilterPanel() {
    const dropdown = document.getElementById("filterDropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

function renderAvailabilityCalendar() {
    const container = document.getElementById("availCalendar");
    if (!container) return;

    const bookedRanges = (window.__bookedRanges || []).map(r => ({
        start: new Date(r.checkIn + "T00:00:00"),
        end: new Date(r.checkOut + "T00:00:00")
    }));

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    container.innerHTML = "";

    const monthsToRender = [
        new Date(now.getFullYear(), now.getMonth(), 1),
        new Date(now.getFullYear(), now.getMonth() + 1, 1)
    ];

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    monthsToRender.forEach(monthDate => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();

        const monthCard = document.createElement("div");
        monthCard.className = "avail-month";

        const title = document.createElement("div");
        title.className = "avail-month-title";
        title.textContent = monthNames[month] + " " + year;
        monthCard.appendChild(title);

        const weekdays = document.createElement("div");
        weekdays.className = "avail-weekdays";
        dayNames.forEach(d => {
            const span = document.createElement("span");
            span.textContent = d;
            weekdays.appendChild(span);
        });
        monthCard.appendChild(weekdays);

        const daysGrid = document.createElement("div");
        daysGrid.className = "avail-days-grid";

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "avail-day empty";
            daysGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= totalDays; day++) {
            const currentDayDate = new Date(year, month, day);
            const dayCell = document.createElement("div");
            dayCell.className = "avail-day";
            dayCell.textContent = day;

            const isPast = currentDayDate < today;
            const isToday = currentDayDate.getTime() === today.getTime();

            const isBooked = bookedRanges.some(range => {
                return currentDayDate >= range.start && currentDayDate < range.end;
            });

            if (isToday) {
                dayCell.classList.add("today");
            }

            if (isPast) {
                dayCell.classList.add("past");
            } else if (isBooked) {
                dayCell.classList.add("booked");
            } else {
                dayCell.classList.add("available");
                if (checkInInput && checkOutInput) {
                    dayCell.style.cursor = "pointer";
                    dayCell.title = "Click to select date";
                    dayCell.addEventListener("click", () => {
                        const dateString = currentDayDate.toISOString().split("T")[0];
                        if (!checkInInput.value || (checkInInput.value && checkOutInput.value)) {
                            checkInInput.value = dateString;
                            checkInInput.dispatchEvent(new Event("change"));
                            checkOutInput.value = "";
                        } else if (checkInInput.value && !checkOutInput.value) {
                            if (new Date(dateString) > new Date(checkInInput.value)) {
                                checkOutInput.value = dateString;
                                checkOutInput.dispatchEvent(new Event("change"));
                            } else {
                                checkInInput.value = dateString;
                                checkInInput.dispatchEvent(new Event("change"));
                            }
                        }
                    });
                }
            }

            daysGrid.appendChild(dayCell);
        }

        monthCard.appendChild(daysGrid);
        container.appendChild(monthCard);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderAvailabilityCalendar();
});
renderAvailabilityCalendar();