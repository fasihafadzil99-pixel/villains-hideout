// 1. TEST JAVASCRIPT CONNECTION

function testAlert() {
    alert("Success! The script.js file is connected.");
}

// 2. VALIDATE SUBSCRIPTION FORM


function validateForm() {

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const months = document.getElementById("months").value;

    const packageSelected = document.querySelector(
        'input[name="packageChoice"]:checked'
    );

    const terms = document.getElementById("terms");

    let isValid = true;

    // Clear previous error messages
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("packageError").textContent = "";
    document.getElementById("monthsError").textContent = "";
    document.getElementById("termsError").textContent = "";

    // Clear previous input borders
    document.getElementById("name").classList.remove("input-error");
    document.getElementById("email").classList.remove("input-error");
    document.getElementById("phone").classList.remove("input-error");
    document.getElementById("months").classList.remove("input-error");

    // Validate Customer Name
    if (name.trim() === "") {
        document.getElementById("nameError").textContent =
            "Customer name is required.";

        document.getElementById("name").classList.add("input-error");
        isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "") {
        document.getElementById("emailError").textContent =
            "Email address is required.";

        document.getElementById("email").classList.add("input-error");
        isValid = false;

    } else if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent =
            "Please enter a valid email address.";

        document.getElementById("email").classList.add("input-error");
        isValid = false;
    }

    // Validate Phone Number
    const phonePattern = /^01[0-9]{8,9}$/;

    if (phone.trim() === "") {
        document.getElementById("phoneError").textContent =
            "Phone number is required.";

        document.getElementById("phone").classList.add("input-error");
        isValid = false;

    } else if (!phonePattern.test(phone)) {
        document.getElementById("phoneError").textContent =
            "Please enter a valid Malaysian phone number.";

        document.getElementById("phone").classList.add("input-error");
        isValid = false;
    }

    // Validate Package
    if (packageSelected === null) {
        document.getElementById("packageError").textContent =
            "Please select a rental package.";

        isValid = false;
    }

    // Validate Rental Duration
    const rentalMonths = Number(months);

    if (
        months === "" ||
        !Number.isInteger(rentalMonths) ||
        rentalMonths < 1 ||
        rentalMonths > 60
    ) {
        document.getElementById("monthsError").textContent =
            "Please enter a duration between 1 and 60 months.";

        document.getElementById("months").classList.add("input-error");
        isValid = false;
    }

    // Validate Terms and Conditions
    if (!terms.checked) {
        document.getElementById("termsError").textContent =
            "You must agree to the Terms and Conditions.";

        isValid = false;
    }

    return isValid;
}


// 3. CALCULATE SUBSCRIPTION

function calculateSubscription() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const packageSelected = document.querySelector
    ('input[name="packageChoice"]:checked').value;

    const rentalMonths = Number(
        document.getElementById("months").value
    );

    let packageName = "";
    let monthlyPrice = 0;

    // Determine Package Price
    if (packageSelected === "basic") {

        packageName = "Basic Lair";
        monthlyPrice = 500;

    } else if (packageSelected === "advanced") {

        packageName = "Advanced Lair";
        monthlyPrice = 1000;

    } else if (packageSelected === "ultimate") {

        packageName = "Ultimate Lair";
        monthlyPrice = 1800;

    }

    // Calculate Total Price
    const totalPrice = monthlyPrice * rentalMonths;

    // Determine Discount
    let discountRate = 0;

    if (rentalMonths >= 12) {

        discountRate = 0.20;

    } else if (rentalMonths >= 6) {

        discountRate = 0.10;

    } else {

        discountRate = 0;

    }

    // Calculate Discount Amount
    const discountAmount = totalPrice * discountRate;

    // Calculate Final Price
    const finalPrice = totalPrice - discountAmount;

    // Store Subscription Information
    const subscriptionDetails = {

        name: name,
        email: email,
        phone: phone,
        packageName: packageName,
        monthlyPrice: monthlyPrice,
        rentalMonths: rentalMonths,
        totalPrice: totalPrice,
        discountRate: discountRate,
        discountAmount: discountAmount,
        finalPrice: finalPrice

    };

    sessionStorage.setItem(
        "subscriptionDetails",
        JSON.stringify(subscriptionDetails)
    );

    // Open Receipt Page
    window.location.href = "receipt.html";

}

// 4. DISPLAY RECEIPT

function displayReceipt() {

    const details = JSON.parse
    (sessionStorage.getItem("subscriptionDetails"));

    const receiptContent = document.getElementById("receiptContent");
    const finalPrice = document.getElementById("finalPrice");

    if (details === null) {

        receiptContent.textContent =
            "No subscription information found.";

        finalPrice.textContent = "RM 0.00";

        return;
    }

    // Format Malaysian Currency
    function formatRM(amount) {

        return "RM " + amount.toLocaleString("en-MY", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    }

    // Customer and Subscription Information
    const information = [

        ["Customer Name", details.name],
        ["Email Address", details.email],
        ["Phone Number", details.phone],
        ["Selected Package", details.packageName],
        ["Monthly Price", formatRM(details.monthlyPrice)],
        ["Rental Duration", details.rentalMonths + " months"],
        ["Total Before Discount", formatRM(details.totalPrice)],
        ["Discount", (details.discountRate * 100) + "%"],
        ["Discount Amount", formatRM(details.discountAmount)]

    ];

    // Display Information
    information.forEach(function(item) {

        const paragraph = document.createElement("p");

        const label = document.createElement("strong");

        label.textContent = item[0] + ": ";

        paragraph.appendChild(label);

        paragraph.appendChild(
            document.createTextNode(item[1])
        );

        receiptContent.appendChild(paragraph);

    });

    // Display Final Payment
    finalPrice.textContent = formatRM(details.finalPrice);

}

// 5. CONNECT HTML WITH JAVASCRIPT

document.addEventListener("DOMContentLoaded", function() {

    // Subscription Page
    const form = document.getElementById("subscriptionForm");

    if (form) {

        form.addEventListener("submit", function(event) {

            event.preventDefault();

            if (validateForm()) {

                calculateSubscription();

            }

        });

    }

    // Receipt Page
    const receiptContent = document.getElementById("receiptContent");

    if (receiptContent) {

        displayReceipt();

    }

});
