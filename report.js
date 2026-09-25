const API_URL =
    "https://cybershield-production-3c1a.up.railway.app";


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const reportForm = document.getElementById("reportForm");
const reportMessage = document.getElementById("reportMessage");
const submitReportBtn = document.getElementById("submitReportBtn");


// =====================================================
// REPORT FORM
// =====================================================

if (reportForm) {

    reportForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("📝 Report form submitted");


        // =================================================
        // CHECK LOGIN
        // =================================================

        const token = localStorage.getItem("token");

        console.log("🔑 Token exists:", !!token);

        if (!token) {

            reportMessage.textContent =
                "Please login before submitting a report.";

            reportMessage.style.color = "red";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

            return;
        }


        // =================================================
        // GET FORM VALUES
        // =================================================

        const incidentType =
            document.getElementById("incidentType")?.value.trim();

        const name =
            document.getElementById("name")?.value.trim();

        const email =
            document.getElementById("email")?.value.trim();

        const suspiciousUrl =
            document.getElementById("suspiciousUrl")?.value.trim();

        const description =
            document.getElementById("description")?.value.trim();


        console.log("📋 Form values received");


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !incidentType ||
            !name ||
            !email ||
            !description
        ) {

            reportMessage.textContent =
                "Please fill all required fields.";

            reportMessage.style.color = "red";

            return;
        }


        // =================================================
        // BUTTON
        // =================================================

        if (submitReportBtn) {

            submitReportBtn.disabled = true;

            submitReportBtn.textContent =
                "Submitting...";
        }


        // =================================================
        // SEND TO RAILWAY
        // =================================================

        try {

            console.log(
                "🌐 Sending request to:",
                API_URL + "/api/complaints"
            );


            const response = await fetch(
                API_URL + "/api/complaints",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
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


            console.log(
                "📡 Server response status:",
                response.status
            );


            // =================================================
            // READ RESPONSE SAFELY
            // =================================================

            const responseText =
                await response.text();

            console.log(
                "📨 Server response:",
                responseText
            );


            let data = {};

            try {

                data = responseText
                    ? JSON.parse(responseText)
                    : {};

            } catch (jsonError) {

                console.error(
                    "❌ Response is not JSON:",
                    responseText
                );

                reportMessage.textContent =
                    "Server returned an invalid response.";

                reportMessage.style.color = "red";

                return;
            }


            // =================================================
            // BACKEND ERROR
            // =================================================

            if (!response.ok) {

                console.error(
                    "❌ Backend returned error:",
                    data
                );


                if (response.status === 401) {

                    reportMessage.textContent =
                        "Your login session has expired. Please login again.";

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1500);

                    return;
                }


                if (response.status === 404) {

                    reportMessage.textContent =
                        "Report API route not found.";

                    return;
                }


                if (response.status === 500) {

                    reportMessage.textContent =
                        "Server error. Please check the Railway backend.";

                    return;
                }


                reportMessage.textContent =
                    data.message ||
                    "Unable to submit report.";

                reportMessage.style.color = "red";

                return;
            }


            // =================================================
            // SUCCESS
            // =================================================

            if (data.success) {

                console.log(
                    "✅ Report submitted successfully"
                );


                reportMessage.textContent =
                    "✅ Report submitted successfully! " +
                    "Complaint ID: " +
                    data.complaintId;

                reportMessage.style.color = "green";


                // Clear form

                reportForm.reset();

            } else {

                reportMessage.textContent =
                    data.message ||
                    "Unable to submit report.";

                reportMessage.style.color = "red";
            }


        } catch (error) {

            console.error(
                "❌ FETCH ERROR:",
                error
            );


            reportMessage.textContent =
                "❌ Unable to reach the server.";

            reportMessage.style.color = "red";


            console.log(
                "Possible causes:"
            );

            console.log(
                "1. CORS problem"
            );

            console.log(
                "2. Railway backend unavailable"
            );

            console.log(
                "3. Incorrect API URL"
            );

            console.log(
                "4. Network problem"
            );

        } finally {

            // =================================================
            // ENABLE BUTTON
            // =================================================

            if (submitReportBtn) {

                submitReportBtn.disabled = false;

                submitReportBtn.textContent =
                    "Submit Report";
            }
        }

    });

}
