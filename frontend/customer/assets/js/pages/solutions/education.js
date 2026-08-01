/*=====================================
        EDUCATION PAGE
=====================================*/

import { loadNavbar } from "../../components/navbar.js";
import { loadFooter } from "../../components/footer.js";

/*=====================================
        LOAD COMPONENTS
=====================================*/

document.addEventListener("DOMContentLoaded", async () => {

    await loadNavbar();

    await loadFooter();

    initializeAnimations();

});

/*=====================================
        SCROLL ANIMATIONS
=====================================*/

function initializeAnimations() {

    const animatedElements = document.querySelectorAll(

        ".overview-image, \
         .overview-content, \
         .feature-card, \
         .benefit-card, \
         .process-step"

    );

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.15
        }

    );

    animatedElements.forEach((element) => {

        element.classList.add("hidden-animation");

        observer.observe(element);

    });

}

/*=====================================
        SMOOTH SCROLL
=====================================*/

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

    anchor.addEventListener("click", (event) => {

        const target = document.querySelector(

            anchor.getAttribute("href")

        );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({

            behavior: "smooth",
            block: "start"

        });

    });

});