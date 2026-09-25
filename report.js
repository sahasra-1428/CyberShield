const API_URL =
    "https://cybershield-production-3c1a.up.railway.app";


// =====================================================
// REPORT FORM
// =====================================================

const reportForm = document.getElementById("reportForm");
const reportMessage = document.getElementById("reportMessage");
const submitReportBtn = document.getElementById("submitReportBtn");


if (reportForm) {

    reportForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // =================================================
        // GET LOGIN TOKEN
        // =================================================

        const token = localStorage.getItem("token");

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
            document.getElementById("incidentType").value.trim();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const suspiciousUrl =
            document.getElementById("suspiciousUrl").value.trim();

        const description =
            document.getElementById("description").value.trim();


        // =================================================
        // VALIDATION
        // =================================================

        if (!incidentType ||
            !name ||
            !email ||
            !description) {

            reportMessage.textContent =
                "Please fill all required fields.";

            reportMessage.style.color = "red";

            return;
        }


        // =================================================
        // DISABLE BUTTON
        // =================================================

        if (submitReportBtn) {

            submitReportBtn.disabled = true;

            submitReportBtn.textContent =
                "Submitting...";
        }


        // =================================================
        // SEND REPORT TO BACKEND
        // =================================================

        try {

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


            // =================================================
            // READ RESPONSE
            // =================================================

            const data = await response.json();


            // =================================================
            // BACKEND ERROR
            // =================================================

            if (!response.ok) {

                console.error(
                    "Backend error:",
                    data
                );

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
                "❌ Report submission error:",
                error
            );

            reportMessage.textContent =
                "❌ Unable to connect to server.";

            reportMessage.style.color = "red";

        } finally {

            // =================================================
            // ENABLE BUTTON AGAIN
            // =================================================

            if (submitReportBtn) {

                submitReportBtn.disabled = false;

                submitReportBtn.textContent =
                    "Submit Report";
            }
        }

    });

}
