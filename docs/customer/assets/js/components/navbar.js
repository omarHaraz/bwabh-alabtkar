import AuthService from "../../../../auth/services/AuthService.js";

const NAVBAR_HTML_URL = new URL("../../../components/navbar.html", import.meta.url);
const NAVBAR_HOME_URL = new URL("../../../pages/home.html", import.meta.url).href;
const LOGO_ICON_URL = new URL("../../images/logo-icon.png", import.meta.url).href;
const AUTH_BASE_PATH = new URL("../../../../auth/", import.meta.url).pathname;

export async function loadNavbar() {
    const response = await fetch(NAVBAR_HTML_URL);
    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    navbar.innerHTML = await response.text();

    fixNavbarPaths(navbar);
    await renderAuthSection();
    initNavbarEvents();
}

function getRepoPrefix() {
    const pathname = window.location.pathname;
    for (const marker of ["/customer/", "/auth/", "/admin/"]) {
        const index = pathname.indexOf(marker);
        if (index !== -1) {
            return pathname.substring(0, index);
        }
    }
    return "";
}

function normalizeRootAbsoluteHref(href) {
    if (!href || !href.startsWith("/")) {
        return href;
    }
    const prefix = getRepoPrefix();
    return `${prefix}${href}`;
}

function fixNavbarPaths(navbar) {
    const logo = navbar.querySelector(".logo-icon");
    if (logo) {
        logo.src = LOGO_ICON_URL;
    }

    const homeLink = navbar.querySelector(".logo-container");
    if (homeLink) {
        homeLink.href = NAVBAR_HOME_URL;
    }

    navbar.querySelectorAll("a[data-href], a[href^='/customer/'], a[href^='/auth/'], a[href^='/admin/'], a[href^='/coming-soon']").forEach(link => {
        const dataHref = link.getAttribute("data-href");
        const originalHref = dataHref || link.getAttribute("href");
        if (originalHref) {
            const normalized = normalizeRootAbsoluteHref(originalHref);
            link.href = normalized;
            if (dataHref) {
                link.setAttribute("data-href", normalized);
            }
        }
    });
}

/* =========================
        AUTH SECTION
========================= */

async function renderAuthSection() {
    const authSection = document.getElementById("auth-section");
    if (!authSection) return;

    const user = await AuthService.validateSession();

    if (user) {
        authSection.innerHTML = `
            <div class="profile-wrapper">
                <button class="profile-icon" id="profile-icon" type="button">
                    <i class="fa-solid fa-circle-user"></i>
                </button>
                <div class="profile-menu" id="profile-menu">
                    <div class="profile-user">
                        ${user.name || user.fullName || user.email || "User"}
                    </div>
                    <button id="logout-btn" type="button">
                        <i class="fa-solid fa-right-from-bracket"></i> Logout
                    </button>
                </div>
            </div>
        `;
        initProfileMenu();
    } else {
        authSection.innerHTML = `
            <div class="auth-buttons">
                <a href="${AUTH_BASE_PATH}login.html" class="login-btn">Login</a>
                <a href="${AUTH_BASE_PATH}signup.html" class="signup-btn">Sign Up</a>
            </div>
        `;
    }
}

/* =========================
        NAVBAR EVENTS
========================= */

function initNavbarEvents() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const navRight = document.getElementById("nav-right");

    /* Mobile Menu Toggle */
    if (menuBtn && navRight) {
        menuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            navRight.classList.toggle("active");
            const icon = menuBtn.querySelector("i");
            if (navRight.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    }

    /* Mobile Dropdown Arrows ONLY */
    const isMobileViewport = () => window.innerWidth <= 992;

    document.querySelectorAll(".mobile-dropdown .dropdown-toggle-btn").forEach(button => {
        button.addEventListener("click", function (e) {
            if (!isMobileViewport()) return;

            const parent = this.closest(".mobile-dropdown");
            if (!parent) return;

            e.preventDefault();
            e.stopPropagation();
            parent.classList.toggle("active");
        });
    });

    /* Active Link Highlighter */
    const currentPath = window.location.pathname;
    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.pathname === currentPath) {
            link.classList.add("active");
        }
    });

    /* Click Outside to Close */
    document.addEventListener("click", function (e) {
        const navbar = document.querySelector(".navbar");
        if (!navbar) return;

        if (!navbar.contains(e.target)) {
            navRight?.classList.remove("active");
            document.querySelectorAll(".mobile-dropdown").forEach(item => {
                item.classList.remove("active");
            });
            const profileMenu = document.getElementById("profile-menu");
            profileMenu?.classList.remove("active");

            if (menuBtn) {
                const icon = menuBtn.querySelector("i");
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        }
    });
}

/* =========================
        PROFILE MENU
========================= */

function initProfileMenu() {
    const profileIcon = document.getElementById("profile-icon");
    const profileMenu = document.getElementById("profile-menu");
    const logoutBtn = document.getElementById("logout-btn");

    if (!profileIcon || !profileMenu) return;

    profileIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        profileMenu.classList.toggle("active");
    });

    profileMenu.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            AuthService.logout();
            window.location.href = `${AUTH_BASE_PATH}login.html`;
        });
    }
}