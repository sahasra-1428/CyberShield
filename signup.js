console.log("🔥 signup.js is connected!");

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("signupForm");

    if (!form) {
        console.error("❌ signupForm not found");
        return;
    }

    console.log("✅ Signup form found");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("🚀 Create Account clicked");

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        console.log("Name:", name);
        console.log("Email:", email);

        // Check fields
        if (!name || !email || !password || !confirmPassword) {
            alert("❌ All fields are required");
            return;
        }

        // Check password
        if (password !== confirmPassword) {
            alert("❌ Passwords do not match");
            return;
        }

        try {

            console.log("📡 Connecting to backend...");

            const response = await fetch(
                "https://cybershield-production-3c1a.up.railway.app/api/auth/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        confirmPassword: confirmPassword
                    })
                }
            );

            console.log("📡 Backend status:", response.status);

            const data = await response.json();

            console.log("📦 Backend response:", data);

            if (response.ok && data.success) {

                alert("✅ Account created successfully!");

                form.reset();

                window.location.href = "login.html";

            } else {

                alert("❌ " + data.message);

            }

        } catch (error) {

            console.error("❌ Connection error:", error);

            alert(
                "❌ Cannot connect to backend.\n\n" +
                "Make sure Node.js is running on port 5000."
            );
        }
    });
});
