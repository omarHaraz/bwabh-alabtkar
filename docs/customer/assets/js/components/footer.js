const FOOTER_HTML_URL = new URL("../../../components/footer.html", import.meta.url);

export async function loadFooter() {

    const response = await fetch(FOOTER_HTML_URL);

    document.getElementById("footer").innerHTML =
        await response.text();

}