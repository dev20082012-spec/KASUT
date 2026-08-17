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