import { loadNavbar } from "../../components/navbar.js";
import { loadFooter } from "../../components/footer.js";

document.addEventListener("DOMContentLoaded", async () => {

    // =====================================
    // Load Shared Components
    // =====================================

    await loadNavbar();
    await loadFooter();

    // =====================================
    // Smooth Reveal Animation
    // =====================================

    const sections = document.querySelectorAll(
        ".hero-content, .feature-card, .benefit-card, .process-step, .cta-content"
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

    sections.forEach(section => observer.observe(section));

});