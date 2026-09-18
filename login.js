console.log("🔥 login.js is connected!");


document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("loginForm");

    const password =
        document.getElementById("password");

    const showPassword =
        document.getElementById("showPassword");

    const message =
        document.getElementById("loginMessage");


    // =========================
    // CHECK FORM
    // =========================

    if (!form) {

        console.error("❌ loginForm not found");

        return;

    }


    console.log("✅ Login form found");


    // =========================
    // SHOW / HIDE PASSWORD
    // =========================

    if (showPassword) {

        showPassword.addEventListener(
            "click",
            function () {

                if (password.type === "password") {

                    password.type = "text";

                    showPassword.textContent = "🙈";

                } else {

                    password.type = "password";

                    showPassword.textContent = "👁️";

                }

            }
        );

    }


    // =========================
    // LOGIN
    // =========================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const passwordValue =
                password.value;


            // =========================
            // VALIDATION
            // =========================

            if (!email || !passwordValue) {

                message.innerHTML =
                    "❌ Email and password are required.";

                return;

            }


            message.innerHTML =
                "🔄 Logging in...";


            try {

                console.log(
                    "📡 Sending login request..."
                );


                const response =
                    await fetch(
                        "https://cybershield-production-3c1a.up.railway.app/api/auth/login",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                email: email,

                                password: passwordValue

                            })

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Backend response:",
                    data
                );


                // =========================
                // SUCCESS
                // =========================

                if (
                    response.ok &&
                    data.success
                ) {

                    // Save JWT token

                    localStorage.setItem(
                        "cybershieldToken",
                        data.token
                    );


                    // Save user information

                    localStorage.setItem(
                        "cybershieldUser",
                        JSON.stringify(data.user)
                    );


                    message.innerHTML =
                        "✅ Login successful!";


                    // Go to dashboard

                    setTimeout(
                        function () {

                            window.location.href =
                                "user-dashboard.html";

                        },
                        500
                    );


                    return;

                }


                // =========================
                // LOGIN FAILED
                // =========================

                message.innerHTML =
                    "❌ " +
                    (
                        data.message ||
                        "Invalid email or password"
                    );


            } catch (error) {

                console.error(
                    "❌ Login error:",
                    error
                );


                message.innerHTML = `
                    ❌ Cannot connect to backend.
                    
    <br>
    Please check your internet connection or try again.
`;
                `;

            }

        }
    );

});
