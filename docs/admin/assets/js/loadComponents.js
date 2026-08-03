function loadComponent(id, file, callback) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error(`Failed to load ${file}:`, error);
        });
}

function setActiveSidebarItem() {

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll("#sidebar .nav-link").forEach(link => {

        const href = link.getAttribute("href");

        if (href && href.endsWith(currentPage)) {
            link.classList.add("active", "bg-gradient-dark", "text-white");
            link.classList.remove("text-dark");
        } else {
            link.classList.remove("active", "bg-gradient-dark", "text-white");
            link.classList.add("text-dark");
        }

    });
}

function initNavbarUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            const nameEl = document.getElementById("nav-user-name");
            const emailEl = document.getElementById("nav-user-email");
            if (nameEl && user.name) nameEl.textContent = user.name;
            if (emailEl && user.email) emailEl.textContent = user.email;
        } catch (e) {
            console.error("Failed to parse user session:", e);
        }
    }

    const logoutBtn = document.getElementById("nav-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user");
            window.location.href = "../../auth/login.html";
        });
    }
}

// Load Sidebar
loadComponent("sidebar", "../components/sidebar.html", setActiveSidebarItem);

// Load Navbar
loadComponent("navbar", "../components/navbar.html", initNavbarUser);