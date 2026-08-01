const FOOTER_HTML_URL = new URL("../../../components/footer.html", import.meta.url);
const LOGO_ICON_URL = new URL("../../images/logo-icon.png", import.meta.url).href;

export async function loadFooter() {

    const response = await fetch(FOOTER_HTML_URL);

    const footer = document.getElementById("footer");
    if (!footer) return;

    footer.innerHTML = await response.text();

    const logo = footer.querySelector(".logo-icon");
    if (logo) {
        logo.src = LOGO_ICON_URL;
    }

}