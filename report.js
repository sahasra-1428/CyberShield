// ==========================================
// CYBERSHIELD - REPORT A CYBER INCIDENT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const reportForm =
        document.getElementById("reportForm");

    const reportMessage =
        document.getElementById("reportMessage");

    const submitButton =
        document.getElementById("submitReportBtn");


    // Check if form exists
    if (!reportForm) {

        console.error(
            "❌ reportForm was not found."
        );

        return;
    }


    // Check if message box exists
    if (!reportMessage) {

        console.error(
            "❌ reportMessage was not found."
        );

        return;
    }


    // ==========================================
    // FORM SUBMIT
    // ==========================================

    reportForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            // ======================================
            // SHOW LOADING MESSAGE
            // ======================================

            reportMessage.innerHTML = `
                <div class="report-loading">
                    ⏳ Submitting your report...
                </div>
            `;


            // ======================================
            // GET LOGIN TOKEN
            // ======================================

            const token =
                localStorage.getItem("token");


            if (!token) {

                reportMessage.innerHTML = `
                    <div class="report-error">
                        ❌ Your login session has expired.
                        <br>
                        Please login again.
                    </div>
                `;

                return;
            }


            // ======================================
            // GET FORM VALUES
            // ======================================

            const incidentType =
                document
                    .getElementById("incidentType")
                    .value
                    .trim();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const suspiciousUrl =
                document
                    .getElementById("suspiciousUrl")
                    .value
                    .trim();


            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();


            // ======================================
            // VALIDATION
            // ======================================

            if (!incidentType) {

                reportMessage.innerHTML = `
                    <div class="report-error">
                        ⚠️ Please select an incident type.
                    </div>
                `;

                return;
            }


            if (!name) {

                reportMessage.innerHTML = `
                    <div class="report-error">
                        ⚠️ Please enter your name.
                    </div>
                `;

                return;
            }


            if (!email) {

                reportMessage.innerHTML = `
                    <div class="report-error">
                        ⚠️ Please enter your email.
                    </div>
                `;

                return;
            }


            if (!description) {

                reportMessage.innerHTML = `
                    <div class="report-error">
                        ⚠️ Please describe the incident.
                    </div>
                `;

                return;
            }


            // ======================================
            // DISABLE BUTTON
            // ======================================

            submitButton.disabled = true;

            submitButton.textContent =
                "⏳ Submitting...";


            // ======================================
            // SEND TO BACKEND
            // ======================================

            try {

                const response = await fetch(

                    "https://cybershield-production-3c1a.up.railway.app/api/complaints",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token

                        },


                        body: JSON.stringify({

                            title: incidentType,

                            category: incidentType,

                            description:

                                "Name: " +
                                name +

                                "\nEmail: " +
                                email +

                                "\nSuspicious URL: " +
                                suspiciousUrl +

                                "\n\nIncident Description:\n" +
                                description

                        })

                    }

                );


                // ==================================
                // READ SERVER RESPONSE
                // ==================================

                const data =
                    await response.json();


                console.log(
                    "Server response:",
                    data
                );


                // ==================================
                // SUCCESS
                // ==================================

                if (
                    response.ok &&
                    data.success
                ) {

                    const trackingId =
                        data.complaintId ||
                        data.id ||
                        data.insertId ||
                        "Generated";


                    reportMessage.innerHTML = `

                        <div class="report-success">

                            <h3>
                                ✅ Report Submitted Successfully!
                            </h3>

                            <p>
                                Your cyber incident has been
                                securely recorded.
                            </p>

                            <p>
                                <strong>
                                    Tracking ID:
                                </strong>

                                ${trackingId}
                            </p>

                            <p>
                                Our authorized team can review
                                the submitted information.
                            </p>

                        </div>

                    `;


                    // Clear form

                    reportForm.reset();


                }

                // ==================================
                // ERROR FROM SERVER
                // ==================================

                else {

                    reportMessage.innerHTML = `

                        <div class="report-error">

                            ❌
                            ${
                                data.message ||
                                "Unable to submit the report."
                            }

                        </div>

                    `;

                }


            }

            // ======================================
            // CONNECTION ERROR
            // ======================================

            catch (error) {

                console.error(
                    "❌ Report error:",
                    error
                );


                reportMessage.innerHTML = `

                    <div class="report-error">

                        ❌ Cannot connect to
                        CyberShield server.

                        <br><br>

                        Please try again later.

                    </div>

                `;

            }


            // ======================================
            // ENABLE BUTTON AGAIN
            // ======================================

            submitButton.disabled = false;

            submitButton.textContent =
                "🚨 Submit Secure Report";

        }

    );

});
