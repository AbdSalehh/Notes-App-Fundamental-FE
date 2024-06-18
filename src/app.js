import AOS from "aos";
import "aos/dist/aos.css";
import "./script/components/app-bar.js";
import "./script/components/note-item.js";
import "./script/components/note-list.js";
import "./script/components/tabs.js";

import "./styles/style.css";
import "toastify-js/src/toastify.css";

import home from "./script/view/home.js";

document.addEventListener("DOMContentLoaded", () => {
    home();
});

AOS.init({
    once: true,
});
