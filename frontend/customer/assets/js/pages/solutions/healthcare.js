/*=====================================
        HEALTHCARE PAGE
=====================================*/

import { loadNavbar } from "../../components/navbar.js";
import { loadFooter } from "../../components/footer.js";

/*=====================================
        INITIALIZE PAGE
=====================================*/

document.addEventListener("DOMContentLoaded", async () => {

    await loadNavbar();

    await loadFooter();

    initializeAnimations();

    initializeSmoothScroll();

});


/*=====================================
        SCROLL ANIMATIONS
=====================================*/

function initializeAnimations() {

    const elements = document.querySelectorAll(
        ".feature-card, .benefit-card, .process-step, .overview-image, .overview-content"
    );

    elements.forEach(element => {

        element.classList.add("hidden-animation");

    });

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

        observer.observe(element);

    });

}


/*=====================================
        SMOOTH SCROLL
=====================================*/

function initializeSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (event) {

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        });

    });

}