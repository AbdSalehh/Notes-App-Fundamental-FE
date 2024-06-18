import "./add-form.js";
import { getArchivedNotes, getNotes } from "../data/noteServices.js";

class Tabs extends HTMLElement {
    _shadowRoot = null;
    _style = null;

    static get observedAttributes() {
        return ["sort-order"];
    }

    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._style = document.createElement("style");
    }

    connectedCallback() {
        this.render();

        const sortButton = this._shadowRoot.querySelector(".sort");
        let sortOrder = "ascending";
        sortButton.addEventListener("click", () => {
            sortOrder = sortOrder === "ascending" ? "descending" : "ascending";
            this.setAttribute("sort-order", sortOrder);
        });
    }

    _updateStyle() {
        this._style.textContent = `
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 10;
        }
  
        .tab-header__wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 30px;
            padding: 10px 0;
            background: rgb(243, 244, 246);
        }
        
        .tab-header {
            display: flex;
            gap: 10px;
        }
        
        .tab-header>button {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-align: center;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            letter-spacing: 0.025em;
            padding: 8px 15px;
            z-index: 2;
            color: #64748b;
            cursor: pointer;
            transition: all 300ms ease-in-out;
            background-color: white;
            border: 1px solid #d8dee5;
            outline: none;
            border-radius: 5px;
            box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        }
        
        .tab-header>button.active {
            color: white;
            font-weight: 600;
            background-color: #1e293b;
            border: 1px solid #0f172a;
        }
        
        .overlay {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.7);
            transition: opacity 300ms;
            visibility: hidden;
            opacity: 0;
        }
        
        .overlay.active {
            visibility: visible;
            opacity: 1;
            z-index: 999;
        }
        
        .popup {
            margin: 70px auto;
            padding: 20px;
            background: #fff;
            border-radius: 5px;
            width: 40%;
            position: relative;
            transition: all 1s ease-in-out;
        }

        .modal-button {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .modal-button>button {
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 8px;
            cursor: pointer;
            transition: all 300ms ease-in-out;
            box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        }

        .sort {
            color: #0f172a;
            background-color: white;
            border: 1px solid #d8dee5;
        }

        .sort.descending > .sort-icon {
            transform: scaleX(-1);
        }

        .open-modal-button {
            color: white;
            background-color: #075985;
            border: 1px solid #075985;
        }
        
        .modal-button>button:active,
        .tab-header>button:active {
            transform: scale(.9);
        }

        .popup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .popup h2 {
            margin: 0;
            color: #0f172a;
        }
        
        .popup .close {
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 200ms;
            font-size: 25px;
            padding: 5px;
            font-weight: bold;
            text-decoration: none;
            color: #0f172a;
            cursor: pointer;
            background-color: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
        }
        
        .popup .close:active {
            transform: scale(.9);
        }
        
        .popup .content {
            margin-top: 10px;
        }

        @media screen and (max-width: 700px) {
            .popup {
                width: 85%;
            }
        }

        @media screen and (max-width: 480px) {
            .tab-header__wrapper {
                position: fixed;
                bottom: 0;
                top: auto;
                left: 0;
                padding: 10px;
                justify-content: center;
                width: 100%;
                background-color: #f1f5f9;
            }
        
            .tab-header {
                width: 100%;
                justify-content: space-between;
            }
        
            .tab-header>button {
                background-color: transparent;
                border: none;
                font-size: 15px;
                color: #64748b;
                flex-direction: column;
                box-shadow: none;
            }
        
            .tab-header>button:first-child {
                font-size: 22px;
            }

            .tab-header>button:last-child {
                margin-right: 20px;
            }
        
            .tab-header>button>.tab-icon {
                font-size: 20px;
            }
        
            .tab-header>button>span {
                font-size: 13px;
                font-weight: 500;
            }
        
            .tab-header>button.active {
                background-color: transparent;
                border: none;
                color: #0284c7;
                font-weight: 600;
            }
        
            .open-modal-button {
                position: absolute;
                left: 40%;
                bottom: 50px;
            }
        
            .open-modal-button {
                font-size: 40px;
                font-weight: 600;
                border-radius: 50% !important;
            }
        
            .open-modal-button>span {
                display: none;
            }

            .sort {
                position: absolute;
                right: 35px;
                bottom: 90px;
                color: white;
                background-color: #1e293b;
                border: 1px solid #0f172a;
            }
        }
      `;
    }

    _emptyContent() {
        this._shadowRoot.innerHTML = "";
    }

    render() {
        this._emptyContent();
        this._updateStyle();

        this._shadowRoot.appendChild(this._style);
        this._shadowRoot.innerHTML += `
        <div class="tab-header__wrapper">
            <div class="tab-header">
                <button class="tab-button active-button active">
                    <ion-icon name="checkmark-circle"></ion-icon><span>Active</span>
                </button>
                <button class="tab-button archive-button">
                    <ion-icon name="archive" class="tab-icon archive"></ion-icon><span>Archived</span>
                </button>
            </div>
            <div id="popup-wrapper" class="overlay">
                <div class="popup">
                    <div class="popup-header">
                        <h2>Tambah Catatan</h2>
                        <button class="close"><ion-icon name="close-outline"></ion-icon></button>
                    </div>
                    <div class="popup-body">
                        <add-form-element></add-form-element>
                    </div>
                </div>
            </div>
            <div class="modal-button">
                <button class="sort">
                    <ion-icon name="swap-vertical-outline" class="sort-icon "></ion-icon><span>Sort</span>
                </button>
                <button class="open-modal-button">
                    <ion-icon name="add-outline"></ion-icon><span>Add Note</span>
                </button>
            </div>
        </div>
      `;

        this.addEventListeners();
    }

    addEventListeners() {
        const popupButton =
            this._shadowRoot.querySelector(".open-modal-button");
        const popupWrapper = this._shadowRoot.getElementById("popup-wrapper");
        const tabHeaderNodes = this._shadowRoot.querySelectorAll(
            ".tab-header > button"
        );

        popupButton?.addEventListener("click", () => {
            popupWrapper.classList.add("active");
        });

        this._shadowRoot
            .querySelector(".close")
            .addEventListener("click", () => {
                popupWrapper.classList.remove("active");
            });

        this._shadowRoot.addEventListener("click", (event) => {
            if (event.target.classList.contains("overlay")) {
                popupWrapper.classList.remove("active");
            }
        });

        tabHeaderNodes.forEach((node) => {
            node.addEventListener("click", () => this.handleTabClick(node));
        });
    }

    handleTabClick(node) {
        const noteListElement = document.querySelector("note-list");

        this._shadowRoot.querySelector(".active").classList.remove("active");
        node.classList.add("active");
        const icon = node.querySelector("ion-icon");
        const isArchived = icon.classList.contains("archive");

        noteListElement.showLoading();

        const getNotesFunction = isArchived ? getArchivedNotes : getNotes;
        getNotesFunction()
            .then(() => {
                noteListElement.hideLoading();
            })
            .catch((error) => {
                console.error("Error loading notes:", error);
                noteListElement.hideLoading();
            });

        document.dispatchEvent(
            new CustomEvent("filterNotes", {
                detail: { archived: isArchived },
            })
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "sort-order") {
            document.dispatchEvent(
                new CustomEvent("sortNotes", {
                    detail: { order: newValue },
                })
            );
            const sortButton = this._shadowRoot.querySelector(".sort");
            sortButton.classList.remove("ascending", "descending");
            sortButton.classList.add(newValue);
        }
    }
}

customElements.define("tab-element", Tabs);
