// ==========================================
// CYBERSHIELD - EMAIL CHECKER
// ==========================================

function checkEmail() {

    const email = document.getElementById("emailInput").value.trim();
    const result = document.getElementById("emailResult");

    if (email === "") {
        result.innerHTML = "⚠️ Please enter an email address.";
        return;
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        result.innerHTML = `
            <div class="danger-result">
                ❌ Invalid email format
            </div>
        `;

        return;
    }

    const suspiciousWords = [
        "winner",
        "lottery",
        "prize",
        "free-money",
        "urgent",
        "claim",
        "bitcoin",
        "crypto",
        "refund"
    ];

    const lowerEmail = email.toLowerCase();

    let suspicious = false;

    suspiciousWords.forEach(word => {

        if (lowerEmail.includes(word)) {
            suspicious = true;
        }

    });

    if (suspicious) {

        result.innerHTML = `
            <div class="danger-result">
                ⚠️ <strong>Suspicious Email</strong>
                <p>
                    This email contains patterns commonly associated
                    with scam messages.
                </p>
                <p>Do not share passwords, OTPs or financial information.</p>
            </div>
        `;

    } else {

        result.innerHTML = `
            <div class="safe-result">
                ✅ <strong>Email Format Looks Safe</strong>
                <p>
                    No obvious suspicious pattern was detected.
                </p>
                <p>
                    This does not guarantee that the sender is trustworthy.
                </p>
            </div>
        `;

    }
}


// ==========================================
// CYBERSHIELD - PHONE NUMBER CHECKER
// ==========================================

function checkPhone() {

    const phone =
        document.getElementById("phoneInput").value.trim();

    const result =
        document.getElementById("phoneResult");

    if (phone === "") {

        result.innerHTML =
            "⚠️ Please enter a phone number.";

        return;
    }

    // Remove spaces, brackets and hyphens
    const cleanPhone =
        phone.replace(/[\s()-]/g, "");

    // Indian phone number
    const indianPattern =
        /^(\+91|91)?[6-9]\d{9}$/;

    if (!indianPattern.test(cleanPhone)) {

        result.innerHTML = `
            <div class="danger-result">
                ❌ Invalid or unsupported phone number format.
            </div>
        `;

        return;
    }

    // Detect repeated numbers
    const digits =
        cleanPhone.replace("+91", "").replace(/^91/, "");

    const repeatedPattern =
        /(\d)\1{6,}/;

    if (repeatedPattern.test(digits)) {

        result.innerHTML = `
            <div class="danger-result">
                ⚠️ <strong>Suspicious Number Pattern</strong>
                <p>
                    The number contains an unusual repeated-digit pattern.
                </p>
            </div>
        `;

        return;
    }

    result.innerHTML = `
        <div class="safe-result">
            ✅ <strong>Valid Phone Number Format</strong>
            <p>
                The number matches the expected Indian mobile format.
            </p>
            <p>
                ⚠️ Format validation cannot confirm whether the number
                belongs to a legitimate person or organization.
            </p>
        </div>
    `;
}


// ==========================================
// CYBERSHIELD - QR CODE CHECKER
// ==========================================

let qrScanner = null;

function startQRScanner() {

    const result =
        document.getElementById("qrResult");

    if (typeof Html5Qrcode === "undefined") {

        result.innerHTML = `
            <div class="danger-result">
                ❌ QR scanner library could not be loaded.
                <br>
                Check your internet connection.
            </div>
        `;

        return;
    }

    if (qrScanner !== null) {
        return;
    }

    qrScanner =
        new Html5Qrcode("reader");

    const config = {
        fps: 10,
        qrbox: {
            width: 250,
            height: 250
        }
    };

    qrScanner.start(
        {
            facingMode: "environment"
        },
        config,

        function(decodedText) {

            checkQRResult(decodedText);

            qrScanner.stop().then(() => {
                qrScanner = null;
            }).catch(() => {
                qrScanner = null;
            });

        },

        function(errorMessage) {
            // Scanner continuously checks the camera.
        }

    ).catch(function(error) {

        result.innerHTML = `
            <div class="danger-result">
                ❌ Unable to access camera.
                <p>
                    Please allow camera permission in your browser.
                </p>
            </div>
        `;

        qrScanner = null;
    });
}


// ==========================================
// QR RESULT ANALYSIS
// ==========================================

function checkQRResult(text) {

    const result =
        document.getElementById("qrResult");

    let suspicious = false;

    const lowerText =
        text.toLowerCase();

    const suspiciousPatterns = [
        "bit.ly",
        "tinyurl.com",
        "goo.gl",
        "login",
        "verify",
        "password",
        "otp",
        "claim",
        "winner",
        "free",
        "bank",
        "payment"
    ];

    suspiciousPatterns.forEach(pattern => {

        if (lowerText.includes(pattern)) {
            suspicious = true;
        }

    });

    if (suspicious) {

        result.innerHTML = `
            <div class="danger-result">

                ⚠️ <strong>Potentially Suspicious QR Code</strong>

                <p>
                    The QR code contains a link or text with
                    suspicious indicators.
                </p>

                <p>
                    <strong>Decoded Content:</strong>
                </p>

                <p style="word-break: break-word;">
                    ${escapeHTML(text)}
                </p>

                <p>
                    ❌ Do not enter passwords, OTPs or banking details.
                </p>

            </div>
        `;

    } else {

        result.innerHTML = `
            <div class="safe-result">

                ✅ <strong>No Obvious Threat Detected</strong>

                <p>
                    The QR code was successfully decoded.
                </p>

                <p>
                    <strong>Decoded Content:</strong>
                </p>

                <p style="word-break: break-word;">
                    ${escapeHTML(text)}
                </p>

                <p>
                    ⚠️ Always verify the destination before opening
                    a QR-code link.
                </p>

            </div>
        `;

    }
}


// ==========================================
// SECURITY FUNCTION
// Prevent HTML injection from QR content
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}