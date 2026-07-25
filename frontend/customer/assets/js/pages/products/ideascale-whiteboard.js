import { loadNavbar } from "../../components/navbar.js";
import { loadFooter } from "../../components/footer.js";

async function init() {

    await loadNavbar();

    await loadFooter();

}

init();