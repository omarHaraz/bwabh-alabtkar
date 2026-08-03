// Scroll Reveal Animation Observer
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                // Optionally unobserve if we only want one-time animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal-on-scroll, .card, .section-title, .hero-content").forEach(el => {
        el.classList.add("reveal-element");
        revealObserver.observe(el);
    });
});
