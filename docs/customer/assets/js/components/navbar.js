import AuthService from "../../../../auth/services/AuthService.js";

const NAVBAR_HTML_URL = new URL("../../../components/navbar.html", import.meta.url);
const AUTH_BASE_PATH = new URL("../../../../auth/", import.meta.url).pathname;

export async function loadNavbar() {

    const response = await fetch(NAVBAR_HTML_URL);

    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    navbar.innerHTML = await response.text();

    await renderAuthSection();

    initNavbarEvents();

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

                <button
                    class="profile-icon"
                    id="profile-icon"
                    type="button">

                    <i class="fa-solid fa-circle-user"></i>

                </button>

                <div
                    class="profile-menu"
                    id="profile-menu">

                    <div class="profile-user">

                        ${user.name || user.fullName || user.email || "User"}

                    </div>

                    <button
                        id="logout-btn"
                        type="button">

                        <i class="fa-solid fa-right-from-bracket"></i>

                        Logout

                    </button>

                </div>

            </div>

        `;

        initProfileMenu();

    } else {

        authSection.innerHTML = `

            <div class="auth-buttons">

                <a
                    href="${AUTH_BASE_PATH}login.html"
                    class="login-btn">

                    Login

                </a>

                <a
                    href="${AUTH_BASE_PATH}signup.html"
                    class="signup-btn">

                    Sign Up

                </a>

            </div>

        `;

    }

}


/* =========================
        NAVBAR EVENTS
========================= */

function initNavbarEvents() {

    const menuBtn =
        document.getElementById("mobile-menu-btn");

    const navRight =
        document.getElementById("nav-right");


    /* =========================
            MOBILE MENU
    ========================== */

    if (menuBtn && navRight) {

        menuBtn.addEventListener("click", function (e) {

            e.stopPropagation();

            navRight.classList.toggle("active");

            const icon =
                menuBtn.querySelector("i");

            if (navRight.classList.contains("active")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });

    }


    /* =========================
            MOBILE DROPDOWNS
    ========================== */

    document
        .querySelectorAll(".mobile-dropdown > a")
        .forEach(link => {

            link.addEventListener("click", function (e) {

                if (window.innerWidth > 992)
                    return;

                const parent =
                    this.parentElement;

                const submenu =
                    parent.querySelector(".dropdown-menu, .mega-menu");

                if (!submenu)
                    return;

                e.preventDefault();

                parent.classList.toggle("active");

            });

        });


    /* =========================
            ACTIVE LINK
    ========================== */

    const currentPath =
        window.location.pathname;

    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            if (link.pathname === currentPath) {

                link.classList.add("active");

            }

        });


    /* =========================
            CLICK OUTSIDE
    ========================== */

    document.addEventListener("click", function (e) {

        const navbar =
            document.querySelector(".navbar");

        if (!navbar)
            return;

        if (!navbar.contains(e.target)) {

            navRight?.classList.remove("active");

            document
                .querySelectorAll(".mobile-dropdown")
                .forEach(item => {

                    item.classList.remove("active");

                });

            const profileMenu =
                document.getElementById("profile-menu");

            profileMenu?.classList.remove("active");

            if (menuBtn) {

                const icon =
                    menuBtn.querySelector("i");

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

    const profileIcon =
        document.getElementById("profile-icon");

    const profileMenu =
        document.getElementById("profile-menu");

    const logoutBtn =
        document.getElementById("logout-btn");


    if (!profileIcon || !profileMenu)
        return;


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