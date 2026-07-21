// ======================================================
// GLOBAL STORE CONFIGURATION MANAGEMENT
// ======================================================

const SETTINGS_API = "http://localhost:8080/api/admin/settings";
const userRecord = JSON.parse(localStorage.getItem("user"));

if (!userRecord || !userRecord.token) {
    window.location.href = "../../customer/login.html";
}

const SETTINGS_HEADERS = {
    "Authorization": `Bearer ${userRecord.token}`,
    "Content-Type": "application/json"
};

let settingsModal;

document.addEventListener("DOMContentLoaded", async () => {
    settingsModal = new bootstrap.Modal(document.getElementById("storeSettingsModal"));
    document.getElementById("storeSettingsForm").addEventListener("submit", saveStoreSettings);
    
    // Fetch and display the store brand name across all layout sections on load
    await fetchActiveBrandName();
});

/**
 * Fetches store settings on initial load to brand layout text dynamically
 */
async function fetchActiveBrandName() {
    try {
        const response = await fetch(SETTINGS_API, {
            method: "GET",
            headers: { "Authorization": `Bearer ${userRecord.token}` }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.storeName) {
                // Update both elements instantly on page load
                document.getElementById("sidebarBrandName").innerText = data.storeName;
                document.getElementById("footerBrandName").innerText = data.storeName;
            }
        }
    } catch (error) {
        console.error("Failed to fetch initial brand name:", error);
    }
}

/**
 * Opens modal and loads active system settings from database config rows
 */
async function openStoreSettingsModal() {
    try {
        const response = await fetch(SETTINGS_API, {
            method: "GET",
            headers: { "Authorization": `Bearer ${userRecord.token}` }
        });

        if (!response.ok) throw new Error("Failed to load store settings.");

        const data = await response.json();
        
        // Load data parameters directly into input values
        document.getElementById("settingsStoreName").value = data.storeName;
        document.getElementById("settingsSupportEmail").value = data.supportEmail;
        
        settingsModal.show();
    } catch (error) {
        console.error(error);
        showSettingsAlert("Error", "Could not fetch configuration records.", "error");
    }
}

/**
 * Handles form updates via PUT payloads 
 */
async function saveStoreSettings(event) {
    event.preventDefault();

    const saveBtn = document.getElementById("saveSettingsBtn");
    const originalText = saveBtn.innerHTML;

    const storeName = document.getElementById("settingsStoreName").value.trim();
    const supportEmail = document.getElementById("settingsSupportEmail").value.trim();

    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Saving...`;

        const response = await fetch(SETTINGS_API, {
            method: "PUT",
            headers: SETTINGS_HEADERS,
            body: JSON.stringify({ storeName, supportEmail })
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Failed to update configurations.");
        }

        // Change the sidebar brand title and footer copyright text immediately live!
        document.getElementById("sidebarBrandName").innerText = storeName;
        document.getElementById("footerBrandName").innerText = storeName;

        settingsModal.hide();
        showSettingsAlert("Success!", "Store settings updated dynamically.", "success");
    } catch (error) {
        console.error(error);
        showSettingsAlert("Failed", error.message, "error");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

/**
 * Renders custom theme status modal alerts
 */
function showSettingsAlert(title, message, type = "success") {
    const statusModal = new bootstrap.Modal(document.getElementById("statusModal"));
    
    document.getElementById("statusTitle").innerText = title;
    document.getElementById("statusMessage").innerText = message;
    
    const iconBg = document.getElementById("statusIconBg");
    const icon = document.getElementById("statusIcon");
    
    if (type === "success") {
        iconBg.className = "mx-auto mb-3 d-flex align-items-center justify-content-center bg-gradient-success shadow-success";
        icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>`;
    } else {
        iconBg.className = "mx-auto mb-3 d-flex align-items-center justify-content-center bg-gradient-danger shadow-danger";
        icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>`;
    }
    
    statusModal.show();
}