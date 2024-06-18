import {
    createNote,
    displayNotes,
    getArchivedNotes,
    getNotes,
} from "../data/notesServices";
import { Toast } from "../utils/toast";

class AddForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
            .body-input, 
            .title-input {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
    
            .body-input label, 
            .title-input label {
                font-weight: 600;
                margin-top: 10px;
            }
    
            .body-input textarea, 
            .title-input input {
                font-family: 'Inter', sans-serif;
                border: 1px solid #e2e8f0;
                border-radius: 5px;
                padding: 10px;
                font-size: 15px;
                background-color: #f8fafc;
            }
    
            .body-input textarea {
                resize: none;
            }
    
            #add-form .submit {
                font-family: 'Inter', sans-serif;
                letter-spacing: 0.025em;
                margin-top: 10px;
                width: 100%;
                font-weight: 600;
                font-size: 15px;
                padding: 10px;
                color: white;
                background-color: #075985;
                border: 1px solid #075985;
                border-radius: 5px;
                cursor: pointer;
                transition: all 300ms ease-in-out;
                box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
            }
    
            .submit:active {
                transform: scale(.95);
            }
    
            .title-error, .body-error, .char-count {
                margin: 0;
                font-size: 14px;
            }
    
            .title-error, .body-error {
                color: red;
            }
    
            .char-count {
                align-self: flex-end;
                color: #64748b;
                margin-top: -10px;
            }
            </style>
            <form id="add-form">
                <div class="title-input">
                    <label for="title">Judul</label>
                    <input type="text" id="title" placeholder="Judul Catatan">
                    <p class="title-error"></p>
                    <p class="char-count"><span>0</span>/50</p>
                </div>
                <div class="body-input">
                    <label for="body">Isi</label>
                    <textarea id="body" placeholder="Isi Catatan" rows="6"></textarea>
                    <p class="body-error"></p>
                    <p class="char-count"><span>0</span>/200</p>
                </div>
                <button type="submit" class="submit">Tambah</button>
            </form>
        `;

        this.addFormEventListeners();
    }

    addFormEventListeners() {
        const form = this.shadowRoot.querySelector("#add-form");
        const titleInput = this.shadowRoot.querySelector("#title");
        const bodyInput = this.shadowRoot.querySelector("#body");
        const titleError = this.shadowRoot.querySelector(".title-error");
        const bodyError = this.shadowRoot.querySelector(".body-error");
        const titleCharCount = this.shadowRoot.querySelector(
            ".title-error + .char-count span"
        );
        const bodyCharCount = this.shadowRoot.querySelector(
            ".body-error + .char-count span"
        );

        titleInput.addEventListener("input", () => {
            const maxTitleLength = 50;
            if (titleInput.value.length > maxTitleLength) {
                titleInput.value = titleInput.value.slice(0, maxTitleLength);
                titleError.textContent = "Udah cukup";
                titleError.style.color = "#22c55e";
                titleInput.style.outline = "2px solid #22c55e";
            } else {
                titleError.textContent = "";
                titleInput.style.outline = "";
            }
            titleCharCount.textContent = `${titleInput.value.length}`;
        });

        bodyInput.addEventListener("input", () => {
            const maxBodyLength = 200;
            if (bodyInput.value.length > maxBodyLength) {
                bodyInput.value = bodyInput.value.slice(0, maxBodyLength);
                bodyError.textContent = "Udah cukup";
                bodyError.style.color = "#22c55e";
                bodyInput.style.outline = "2px solid #22c55e";
            } else {
                bodyError.textContent = "";
                bodyInput.style.outline = "";
            }
            bodyCharCount.textContent = `${bodyInput.value.length}`;
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            titleError.textContent = "";
            bodyError.textContent = "";
            titleInput.style.outline = "";
            bodyInput.style.outline = "";

            if (!titleInput.value.trim()) {
                titleError.textContent = "Judul catatan diisi dulu";
                titleError.style.color = "#ef4444";
                titleInput.style.outline = "2px solid #ef4444";
                return;
            }

            if (!bodyInput.value.trim()) {
                bodyError.textContent = "Body catatan tidak boleh kosong ya";
                bodyError.style.color = "#ef4444";
                bodyInput.style.outline = "2px solid #ef4444";
                return;
            }

            try {
                const noteListElement = document.querySelector("note-list");
                const tabsComponent = document.querySelector("tab-element");
                const activeButton =
                    tabsComponent.shadowRoot.querySelector(".active-button");
                const archiveButton =
                    tabsComponent.shadowRoot.querySelector(".archive-button");
                const popupWrapper =
                    tabsComponent.shadowRoot.getElementById("popup-wrapper");

                await createNote({
                    title: titleInput.value,
                    body: bodyInput.value,
                });

                if (archiveButton.classList.contains("active")) {
                    archiveButton.classList.remove("active");
                    activeButton.classList.add("active");
                }

                Toast("Catatan berhasil ditambahkan", "#16a34a");

                displayNotes(
                    noteListElement,
                    false,
                    null,
                    getNotes,
                    getArchivedNotes
                );
                form.reset();

                if (popupWrapper?.classList.contains("active")) {
                    popupWrapper.classList.remove("active");
                }
            } catch (error) {
                Toast("Catatan gagal ditambahkan", "#dc2626");
            }
        });
    }
}

customElements.define("add-form-element", AddForm);
