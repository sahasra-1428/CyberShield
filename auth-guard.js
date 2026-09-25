// ==========================================
// CYBERSHIELD AUTHENTICATION GUARD
// ==========================================

(function () {

    const token = localStorage.getItem("token");

    // No token = not logged in
    if (!token) {
        window.location.href = "login.html";
        return;
    }

})();
