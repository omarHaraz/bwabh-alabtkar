/*=====================================
        GOVERNMENT PAGE
=====================================*/

import { loadNavbar } from "../../components/navbar.js";
import { loadFooter } from "../../components/footer.js";

/*=====================================
        INITIALIZE
=====================================*/

document.addEventListener("DOMContentLoaded", async () => {

    await loadNavbar();

    await loadFooter();

    setActiveNav();

    initRevealAnimation();

    initSmoothScroll();

});


/*=====================================
        ACTIVE NAVIGATION
=====================================*/

function setActiveNav() {

    const links = document.querySelectorAll(".nav-links a");

    links.forEach(link => {

        link.classList.remove("active");

        if (link.href === window.location.href) {

            link.classList.add("active");

        }

    });

}


/*=====================================
        SMOOTH SCROLL
=====================================*/

function initSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        });

    });

}


/*=====================================
        SCROLL REVEAL
=====================================*/

function initRevealAnimation() {

    const elements = document.querySelectorAll(

        ".feature-card, .benefit-card, .process-step, .overview-image, .overview-content"

    );

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {

        threshold: 0.15

    });

    elements.forEach(element => {

        element.classList.add("hidden-element");

        observer.observe(element);

    });

}