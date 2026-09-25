(function () {

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    console.log("Token:", token);
    console.log("User:", user);

    if (!token || !user) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    }

})();
