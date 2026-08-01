export async function loadFooter() {

    const response = await fetch("/customer/components/footer.html");

    document.getElementById("footer").innerHTML =
        await response.text();

}