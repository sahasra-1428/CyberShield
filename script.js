/* =========================================================
   CYBERSHIELD - FRONTEND JAVASCRIPT
   Cyber Scam Protection System
   ========================================================= */

const API_BASE_URL = "/api";

function getStoredObject(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.warn(`Ignoring invalid stored data for ${key}.`);
        localStorage.removeItem(key);
        return null;
    }
}

async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("cybershieldToken");
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Unable to reach the server.");
    }

    return data;
}


/* ================= NAVBAR ================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("CyberShield Frontend Loaded");

    setupNavigation();
    setupButtons();
    setupAuthentication();
    setupForms();
    setupURLChecker();
    setupScamDetector();
    setupAlerts();
    setupLiveStatus();
    animateStatNumbers();

});


/* ================= NAVIGATION ================= */

function setupNavigation() {

    const navLinks = document.querySelectorAll(".navbar nav a");

    navLinks.forEach(link => {

        link.addEventListener("click", function () {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            this.classList.add("active");

        });

    });

}


/* ================= BUTTONS ================= */

function setupButtons() {

    const scanButtons =
        document.querySelectorAll(
            ".scan-button, .primary-button"
        );

    scanButtons.forEach(button => {

        button.addEventListener("click", function () {

            console.log(
                "Button clicked:",
                this.textContent.trim()
            );

        });

    });

}


/* ================= LOGIN ================= */

async function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("email")?.value.trim();

    const password =
        document.getElementById("password")?.value.trim();


    if (!email || !password) {

        showMessage(
            "Please enter your email and password.",
            "error"
        );

        return;

    }


    try {
        const data = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        localStorage.setItem("cybershieldUser", JSON.stringify(data.user));
        localStorage.setItem("cybershieldToken", data.token);
        showMessage(data.message, "success");
        setTimeout(() => { window.location.href = "user-dashboard.html"; }, 600);
    } catch (error) {
        showMessage(error.message, "error");
    }

}


/* ================= SIGNUP ================= */

async function signupUser(event) {

    event.preventDefault();


    const name =
        document.getElementById("signupName")?.value.trim();

    const email =
        document.getElementById("signupEmail")?.value.trim();

    const password =
        document.getElementById("signupPassword")?.value.trim();

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        )?.value.trim();


    if (!name || !email || !password) {

        showMessage(
            "Please fill all required fields.",
            "error"
        );

        return;

    }


    if (password !== confirmPassword) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;

    }


    try {
        const data = await apiRequest("/auth/signup", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
                confirmPassword
            })
        });

        showMessage(data.message, "success");
        setTimeout(() => { window.location.href = "login.html"; }, 600);
    } catch (error) {
        showMessage(error.message, "error");
    }

}

function setupAuthentication() {
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", signupUser);
    }
}


/* ================= LOGOUT ================= */

function logoutUser() {

    localStorage.removeItem(
        "cybershieldUser"
    );

    localStorage.removeItem(
        "cybershieldToken"
    );


    window.location.href =
        "login.html";

}


/* ================= CHECK LOGIN ================= */

function checkLogin() {

    const user =
        localStorage.getItem(
            "cybershieldUser"
        );


    if (!user) {

        window.location.href =
            "login.html";

        return false;

    }


    return true;

}


/* ================= URL CHECKER ================= */

function setupURLChecker() {

    const form =
        document.getElementById(
            "urlCheckerForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const urlInput =
                document.getElementById(
                    "url"
                );


            if (!urlInput) return;


            const url =
                urlInput.value.trim();


            if (!url) {

                showMessage(
                    "Please enter a URL.",
                    "error"
                );

                return;

            }


            checkURL(url);

        }
    );

}


/* ================= URL ANALYSIS ================= */

function checkURL(url) {

    const resultBox =
        document.getElementById(
            "urlResult"
        );


    /*
       Basic frontend heuristic.

       The real detection system will
       later be handled by Node.js.
    */

    let risk = "Low";
    let message =
        "This URL does not show obvious warning signs.";

    const suspiciousWords = [

        "login-verify",
        "account-verify",
        "free-money",
        "claim-prize",
        "urgent",
        "verify-account",
        "secure-login",
        "gift-card"

    ];


    const lowerURL =
        url.toLowerCase();


    suspiciousWords.forEach(word => {

        if (lowerURL.includes(word)) {

            risk = "High";

            message =
                "This URL contains patterns commonly associated with suspicious links.";

        }

    });


    if (
        lowerURL.includes("@") ||
        lowerURL.length > 150
    ) {

        risk = "High";

        message =
            "The URL contains unusual characteristics.";

    }


    if (!/^https?:\/\//i.test(url)) {

        risk = "Medium";

        message =
            "The URL does not use a standard HTTP/HTTPS format.";

    }


    displayURLResult(
        risk,
        message
    );

    addSecurityActivity({
        type: "URL",
        input: url,
        risk: risk === "High" ? "high" : risk === "Medium" ? "medium" : "safe",
        label: risk === "High" ? "HIGH" : risk === "Medium" ? "SUSPICIOUS" : "SAFE",
        status: risk === "High" ? "Blocked" : risk === "Medium" ? "Reviewed" : "Verified"
    });

}


/* ================= URL RESULT ================= */

function displayURLResult(
    risk,
    message
) {

    const resultBox =
        document.getElementById(
            "urlResult"
        );


    if (!resultBox) return;


    resultBox.style.display =
        "block";


    let icon = "🟢";


    if (risk === "Medium") {
        icon = "🟡";
    }


    if (risk === "High") {
        icon = "🔴";
    }


    resultBox.innerHTML = `

        <div class="result-card">

            <h3>
                ${icon} Risk Level: ${risk}
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;

}


/* ================= SCAM DETECTOR ================= */

function setupScamDetector() {

    const form =
        document.getElementById(
            "scamDetectorForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const message =
                document.getElementById(
                    "message"
                )?.value.trim();


            if (!message) {

                showMessage(
                    "Please enter a message.",
                    "error"
                );

                return;

            }


            detectScam(message);

        }
    );

}


/* ================= SCAM ANALYSIS ================= */

function detectScam(message) {

    const lowerMessage =
        message.toLowerCase();


    const warningWords = [

        "otp",
        "password",
        "urgent",
        "click now",
        "claim",
        "winner",
        "prize",
        "bank account",
        "verify",
        "send money",
        "limited time",
        "free gift"

    ];


    let detectedWords = [];


    warningWords.forEach(word => {

        if (
            lowerMessage.includes(word)
        ) {

            detectedWords.push(word);

        }

    });


    let risk = "Low";


    if (detectedWords.length >= 3) {

        risk = "High";

    }

    else if (
        detectedWords.length >= 1
    ) {

        risk = "Medium";

    }


    displayScamResult(
        risk,
        detectedWords
    );

    addSecurityActivity({
        type: "Message",
        input: message.length > 30 ? `${message.slice(0, 30)}...` : message,
        risk: risk === "High" ? "high" : risk === "Medium" ? "medium" : "safe",
        label: risk === "High" ? "HIGH" : risk === "Medium" ? "SUSPICIOUS" : "SAFE",
        status: risk === "High" ? "Flagged" : risk === "Medium" ? "Reviewed" : "Verified"
    });

}


/* ================= SCAM RESULT ================= */

function displayScamResult(
    risk,
    detectedWords
) {

    const resultBox =
        document.getElementById(
            "scamResult"
        );


    if (!resultBox) return;


    let icon = "🟢";


    if (risk === "Medium") {
        icon = "🟡";
    }


    if (risk === "High") {
        icon = "🔴";
    }


    let details =
        "No obvious scam indicators detected.";


    if (detectedWords.length > 0) {

        details =
            "Warning indicators: " +
            detectedWords.join(", ");

    }


    resultBox.style.display =
        "block";


    resultBox.innerHTML = `

        <div class="result-card">

            <h3>
                ${icon} Scam Risk: ${risk}
            </h3>

            <p>
                ${details}
            </p>

            ${
                risk === "High"
                ?
                `
                <p>
                    ⚠️ Avoid clicking links,
                    sharing OTPs or providing
                    personal information.
                </p>
                `
                :
                ""
            }

        </div>

    `;

}


/* ================= REPORT FORM ================= */

function setupForms() {

    const reportForm =
        document.getElementById(
            "reportForm"
        );


    if (!reportForm) return;


    reportForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const category = document.getElementById("crimeType")?.value;
            const description = document.getElementById("description")?.value.trim();
            const suspiciousUrl = document.getElementById("suspiciousUrl")?.value.trim();

            if (!category || !description) {
                showMessage("Please complete the incident type and description.", "error");
                return;
            }

            try {
                const data = await apiRequest("/complaints", {
                    method: "POST",
                    body: JSON.stringify({
                        title: `${category} report`,
                        category,
                        description: suspiciousUrl
                            ? `${description}\n\nSuspicious URL: ${suspiciousUrl}`
                            : description
                    })
                });

                showMessage(data.message, "success");
                reportForm.reset();
            } catch (error) {
                showMessage(error.message, "error");
            }

        }
    );

}


/* ================= SAVE REPORT ================= */

function saveReport(report) {

    let reports = getStoredObject("cybershieldReports");
    if (!Array.isArray(reports)) {
        reports = [];
    }


    report.id =
        "CSP-" +
        Date.now();


    reports.push(report);


    localStorage.setItem(
        "cybershieldReports",
        JSON.stringify(reports)
    );

}


/* ================= SECURITY ALERTS ================= */

function setupAlerts() {

    const alertContainer =
        document.getElementById(
            "securityAlerts"
        );


    if (!alertContainer) return;


    const alerts = [

        {
            title:
                "Phishing Alert",

            message:
                "Be careful with unexpected login links."
        },

        {
            title:
                "OTP Safety",

            message:
                "Never share your OTP with anyone."
        },

        {
            title:
                "Online Scam Warning",

            message:
                "Verify offers before sending money."
        }

    ];


    alertContainer.innerHTML = "";


    alerts.forEach((alert, index) => {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "security-alert";

        if (index === 0) {
            element.classList.add("active");
        }


        element.innerHTML = `

            <strong>
                🔔 ${alert.title}
            </strong>

            <p>
                ${alert.message}
            </p>

        `;


        alertContainer.appendChild(
            element
        );

    });

    let activeIndex = 0;

    setInterval(() => {

        const items =
            alertContainer.querySelectorAll(
                ".security-alert"
            );


        if (!items.length) return;

        items.forEach((item, index) => {
            item.classList.toggle(
                "active",
                index === activeIndex
            );
        });


        activeIndex =
            (activeIndex + 1) % items.length;

    }, 2600);

}


function setupLiveStatus() {

    const badge =
        document.querySelector(
            ".hero-badge"
        );


    if (badge) {
        const dot =
            document.createElement(
                "span"
            );

        dot.className = "live-dot";
        badge.prepend(dot);
        badge.innerHTML = `${dot.outerHTML} Live · Monitoring 24/7`;
    }


    const timeLabel =
        document.querySelector(
            ".live-clock"
        );


    if (timeLabel) {
        const updateClock = () => {
            const now = new Date();
            timeLabel.textContent = now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

}


function animateStatNumbers() {

    const statNumbers =
        document.querySelectorAll(
            ".stat-number"
        );


    statNumbers.forEach(element => {

        const match =
            element.textContent.trim().match(
                /([^\d]*)(\d+(?:\.\d+)?)([^\d]*)/
            );

        if (!match) return;

        const prefix = match[1] || "";
        const target = parseFloat(match[2]);
        const suffix = match[3] || "";

        if (!Number.isFinite(target)) return;

        let current = 0;
        const step = Math.max(target / 50, 0.1);

        const formatter = value => {
            let output = value.toFixed(target >= 10 || suffix.includes("%") ? 0 : 1);

            if (suffix.includes("K")) {
                output = `${(value / 1000).toFixed(1)}K`;
            }

            if (suffix.includes("M")) {
                output = `${(value / 1000000).toFixed(1)}M`;
            }

            return `${prefix}${output}${suffix}`;
        };

        const tick = () => {
            current += step;

            if (current >= target) {
                current = target;
                element.textContent = formatter(current);
                return;
            }

            element.textContent = formatter(current);
            requestAnimationFrame(tick);
        };

        tick();

    });

}


/* ================= DASHBOARD ================= */

function loadDashboard() {

    const user = getStoredObject("cybershieldUser");


    if (!user) return;


    const nameElement =
        document.getElementById(
            "userName"
        );


    const emailElement =
        document.getElementById(
            "userEmail"
        );


    if (nameElement) {

        nameElement.textContent =
            user.username ||
            user.name ||
            user.email;

    }


    if (emailElement) {

        emailElement.textContent =
            user.email;

    }


    loadReports();

}


/* ================= LOAD REPORTS ================= */

async function loadReports() {

    const reportContainer =
        document.getElementById(
            "reportList"
        );


    if (!reportContainer) return;


    let reports = [];
    try {
        const data = await apiRequest("/complaints");
        reports = Array.isArray(data.complaints) ? data.complaints : [];
    } catch (error) {
        reportContainer.innerHTML = `<p>${error.message}</p>`;
        return;
    }


    if (reports.length === 0) {

        reportContainer.innerHTML = `

            <p>
                No reports submitted yet.
            </p>

        `;

        return;

    }


    reportContainer.innerHTML = "";


    reports.forEach(report => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "report-item";


        const heading = document.createElement("h4");
        heading.textContent = report.category || "Cyber Crime";

        const description = document.createElement("p");
        description.textContent = report.description || "";

        const reportId = document.createElement("small");
        reportId.textContent = `Report ID: CSP-${report.id}`;

        item.append(heading, description, reportId);


        reportContainer.appendChild(
            item
        );

    });

}


/* ================= MESSAGE ================= */

function showMessage(
    message,
    type = "success"
) {

    let box =
        document.getElementById(
            "messageBox"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "messageBox";

        document.body.appendChild(
            box
        );

    }


    box.textContent =
        message;


    box.className =
        `message-box ${type}`;


    box.style.display =
        "block";


    setTimeout(() => {

        box.style.display =
            "none";

    }, 3000);

}


/* ================= INITIALIZE DASHBOARD ================= */

function getRelativeTime(date) {

    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;

}


function getSeedActivity() {

    return [
        {
            type: "URL",
            input: "verify-account-security.net",
            risk: "high",
            label: "HIGH",
            status: "Blocked",
            date: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
            type: "SMS",
            input: "Your account is locked. Tap to recover now.",
            risk: "high",
            label: "HIGH",
            status: "Flagged",
            date: new Date(Date.now() - 5 * 60 * 60 * 1000)
        },
        {
            type: "Email",
            input: "security-update@banking-portal-check.com",
            risk: "medium",
            label: "SUSPICIOUS",
            status: "Reviewed",
            date: new Date(Date.now() - 18 * 60 * 60 * 1000)
        },
        {
            type: "QR",
            input: "Invoice payment request",
            risk: "safe",
            label: "SAFE",
            status: "Verified",
            date: new Date(Date.now() - 26 * 60 * 60 * 1000)
        }
    ];

}


function renderActivityTable() {

    const tableBody = document.getElementById("activityTableBody");

    if (!tableBody) return;

    const stored = getStoredObject("cspRecentActivity");
    const events = Array.isArray(stored) && stored.length
        ? stored
        : getSeedActivity();

    tableBody.innerHTML = events.map(event => {

        const statusClass = event.risk === "high"
            ? "risk-high"
            : event.risk === "medium"
                ? "risk-medium"
                : "risk-safe";

        return `
            <tr>
                <td>${event.type}</td>
                <td>${event.input}</td>
                <td>${getRelativeTime(new Date(event.date))}</td>
                <td><span class="risk-badge ${statusClass}">${event.label}</span></td>
                <td>${event.status}</td>
            </tr>
        `;

    }).join("");

}


function addSecurityActivity({ type, input, risk, label, status }) {

    const tableBody = document.getElementById("activityTableBody");

    if (!tableBody) return;

    const events = getStoredObject("cspRecentActivity") || [];
    const next = [
        {
            type,
            input,
            risk,
            label,
            status,
            date: new Date()
        },
        ...events
    ].slice(0, 6);

    localStorage.setItem("cspRecentActivity", JSON.stringify(next));
    renderActivityTable();

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderActivityTable();

        if (
            document.getElementById(
                "userName"
            )
        ) {

            loadDashboard();

        }

    }
);


/* ================= EXPORT FUNCTIONS ================= */

window.loginUser =
    loginUser;

window.signupUser =
    signupUser;

window.logoutUser =
    logoutUser;

window.checkLogin =
    checkLogin;

window.checkURL =
    checkURL;

window.detectScam =
    detectScam;

window.loadDashboard =
    loadDashboard;
