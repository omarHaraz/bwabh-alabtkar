// ======================================================
// PUBLIC STORE CONFIGURATION BRANDING
// ======================================================

const PUBLIC_SETTINGS_API = "http://localhost:8080/api/admin/settings";

document.addEventListener("DOMContentLoaded", async () => {
    await loadPublicStoreBranding();
});

/**
 * Fetches store settings from the backend and updates logo and title branding
 */
async function loadPublicStoreBranding() {
    try {
        const response = await fetch(PUBLIC_SETTINGS_API, {
            method: "GET" // Public GET request without Authorization headers
        });

        if (response.ok) {
            const data = await response.json();
            if (data.storeName) {
                const upperStoreName = data.storeName.toUpperCase();
                
                // Update the logo text
                document.getElementById("siteLogo").innerText = data.storeName;
                
                // Update the browser tab window title
                document.getElementById("pageTitle").innerText = upperStoreName;
            }
        }
    } catch (error) {
        console.error("Could not load public store branding:", error);
    }
}