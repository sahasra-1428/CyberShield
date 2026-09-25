const API_URL =
    "https://cybershield-production-3c1a.up.railway.app";


const reportForm =
    document.getElementById("reportForm");

const reportMessage =
    document.getElementById("reportMessage");

const submitReportBtn =
    document.getElementById("submitReportBtn");


if (reportForm) {

    reportForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log("📝 Report submitted");


            // CHECK LOGIN
            const token =
                localStorage.getItem("token");

            console.log(
                "Token exists:",
                !!token
            );


            if (!token) {

                reportMessage.textContent =
                    "Please login before submitting a report.";

                reportMessage.style.color =
                    "red";

                return;
            }


            // GET FORM VALUES
            const incidentType =
                document
                    .getElementById("incidentType")
                    ?.value.trim();

            const name =
                document
                    .getElementById("name")
                    ?.value.trim();

            const email =
                document
                    .getElementById("email")
                    ?.value.trim();

            const suspiciousUrl =
                document
                    .getElementById("suspiciousUrl")
                    ?.value.trim();

            const description =
                document
                    .getElementById("description")
                    ?.value.trim();


            // VALIDATION
            if (
                !incidentType ||
                !name ||
                !email ||
                !description
            ) {

                reportMessage.textContent =
                    "Please fill all required fields.";

                reportMessage.style.color =
                    "red";

                return;
            }


            // BUTTON
            submitReportBtn.disabled = true;

            submitReportBtn.textContent =
                "Submitting...";


            try {

                console.log(
                    "Sending request..."
                );


                const response =
                    await fetch(
                        API_URL +
                        "/api/complaints",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token
                            },

                            body:
                                JSON.stringify({

                                    title:
                                        incidentType,

                                    category:
                                        incidentType,

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
                    "Response status:",
                    response.status
                );


                const responseText =
                    await response.text();

                console.log(
                    "Server response:",
                    responseText
                );


                let data = {};

                try {

                    data =
                        responseText
                            ? JSON.parse(responseText)
                            : {};

                } catch (error) {

                    reportMessage.textContent =
                        "Server returned an invalid response.";

                    reportMessage.style.color =
                        "red";

                    return;
                }


                // 401
                if (response.status === 401) {

                    reportMessage.textContent =
                        "Login session expired. Please login again.";

                    reportMessage.style.color =
                        "red";

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    return;
                }


                // 404
                if (response.status === 404) {

                    reportMessage.textContent =
                        "Report API route not found.";

                    reportMessage.style.color =
                        "red";

                    return;
                }


                // 500
                if (response.status === 500) {

                    reportMessage.textContent =
                        data.message ||
                        "Server error.";

                    reportMessage.style.color =
                        "red";

                    return;
                }


                // OTHER ERROR
                if (!response.ok) {

                    reportMessage.textContent =
                        data.message ||
                        "Unable to submit report.";

                    reportMessage.style.color =
                        "red";

                    return;
                }


                // SUCCESS
                if (data.success) {

                    reportMessage.textContent =
                        "✅ Report submitted successfully! " +
                        "Complaint ID: " +
                        data.complaintId;

                    reportMessage.style.color =
                        "green";

                    reportForm.reset();

                } else {

                    reportMessage.textContent =
                        data.message ||
                        "Unable to submit report.";

                    reportMessage.style.color =
                        "red";
                }


            } catch (error) {

                console.error(
                    "❌ Fetch error:",
                    error
                );

                reportMessage.textContent =
                    "❌ Unable to reach the server.";

                reportMessage.style.color =
                    "red";
            }


            // ENABLE BUTTON
            submitReportBtn.disabled =
                false;

            submitReportBtn.textContent =
                "Submit Report";
        }
    );
}
