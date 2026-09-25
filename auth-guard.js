(function requireLogin() {
    const token = localStorage.getItem("cybershieldToken");
    const user = localStorage.getItem("cybershieldUser");

    if (!token || !user) {
        window.location.replace("login.html");
    }
})();
