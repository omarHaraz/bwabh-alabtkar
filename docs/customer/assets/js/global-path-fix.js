/**
 * Global path fixer - normalizes all absolute paths for GitHub Pages
 * Runs on every page to ensure links work on both localhost and GitHub Pages
 */

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

function normalizeAbsoluteHref(href) {
    if (!href || !href.startsWith("/")) {
        return href;
    }
    const prefix = getRepoPrefix();
    if (!prefix) {
        return href; // Localhost - no prefix needed
    }
    // Check if already has prefix
    if (href.startsWith(prefix + "/")) {
        return href;
    }
    return `${prefix}${href}`;
}

// Fix all links on page load
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("a[href^='/']").forEach(link => {
        const originalHref = link.getAttribute("href");
        if (originalHref) {
            const normalized = normalizeAbsoluteHref(originalHref);
            link.href = normalized;
        }
    });
    
    // Also fix any data-href attributes
    document.querySelectorAll("[data-href^='/']").forEach(element => {
        const originalHref = element.getAttribute("data-href");
        if (originalHref) {
            const normalized = normalizeAbsoluteHref(originalHref);
            element.setAttribute("data-href", normalized);
        }
    });
});

// Also run immediately for links that might be clicked before DOMContentLoaded
document.querySelectorAll("a[href^='/']").forEach(link => {
    const originalHref = link.getAttribute("href");
    if (originalHref) {
        const normalized = normalizeAbsoluteHref(originalHref);
        link.href = normalized;
    }
});
