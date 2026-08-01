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

// Load Sidebar
loadComponent("sidebar", "../components/sidebar.html", setActiveSidebarItem);

// Load Navbar
loadComponent("navbar", "../components/navbar.html");