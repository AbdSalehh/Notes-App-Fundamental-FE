import {
    archiveNote,
    deleteNote,
    displayNotes,
    unarchiveNote,
    getNotes,
    getArchivedNotes,
} from "../data/noteServices.js";
import { DateFormat } from "../utils/dateFormat.js";
import { Toast } from "../utils/toast.js";

class NoteItem extends HTMLElement {
    _shadowRoot = null;
    _style = null;
    _note = {
        id: null,
        title: null,
        body: null,
        createdAt: null,
        archived: false,
    };

    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._style = document.createElement("style");
    }

    _emptyContent() {
        this._shadowRoot.innerHTML = "";
    }

    set note(value) {
        this._note = value;
        this.render();
        this.addEventListeners();
    }

    get note() {
        return this._note;
    }

    _updateStyle() {
        this._style.textContent = `
        :host {
            background: white;
            border-radius: 10px;
            border: 1px solid #d8dee5;
        }

        .note-item {
            padding: 20px;
        }
  
        .tab {
            display: flex;
            align-items: start;
            justify-content: space-between;
        }

        h1 {
            color: #0f172a;
            margin-bottom: 10px;
        }
        
        .note-info .date {
            color: #64748b;
            font-size: 13px;
            letter-spacing: 0.025em;
            margin: 0;
        }
        
        .note-info .status {
            margin: 10px 0 0 0;
            display: inline-flex;
            align-items: center;
            font-size: 10px;
            letter-spacing: 0.025em;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 9999px;
        }

        .note-info .status.Active {
            color: #16a34a;
            background-color: #f0fdf4;
            border: 1px solid #16a34a;
        }

        .note-info .status.Archived {
            color: #f59e0b;
            background-color: #fffbeb;
            border: 1px solid #f59e0b;
        }
        
        .note-title {
            color: #0f172a;
            font-weight: 600;
            font-size: 20px;
            line-height: 1.5;
            margin-top: 10px;
            letter-spacing: 0.025em;
        }
        
        .note-description {
            margin: 0;
            color: #475569;
            font-size: 14px;
            line-height: 1.5;
            letter-spacing: 0.025em;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
        }
        
        .tab-button__wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 5px;
            background-color: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 3px;
            transition: transform 300ms ease-in-out;
        }
        
        .tab-button {
            position: absolute;
            top: 35px;
            right: 0;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s;
            background-color: white;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
        }
        
        .tab-button__wrapper:hover {
            transform: scale(.9);
        }
        
        .tab-button__wrapper:hover .tab-button {
            opacity: 1;
            visibility: visible;
        }
        
        .delete-modal, .archive-button, .active-button {
            font-family: 'Inter', sans-serif;
            border: none;
            background-color: transparent;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: start;
            transition: all 300ms ease-in-out;
            padding: 10px;
        }
        
        .delete-modal>span, .archive-button>span, .active-button>span {
            margin-left: 8px;
        }
        
        .delete-modal {
            width: 100%;
            color: #ef4444;
            background-color: #fef2f2;
        }
        
        .archive-button {
            color: #f59e0b;
            background-color: #fffbeb;
        }

        .active-button {
            color: #16a34a;
            background-color: #f0fdf4;
        }
        
        .delete-modal:active, .archive-button:active, .active-button:active {
            transform: scale(.9);
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
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999;
        }
      
        .overlay.active {
            visibility: visible;
            opacity: 1;
            z-index: 999;
        }
      
        .popup {
            display: flex;
            gap: 20px;
            align-items: start;
            margin: 70px auto;
            padding: 20px;
            background: #fff;
            border-radius: 10px;
            width: 40%;
            position: relative;
            transition: all 1s ease-in-out;
        }

        .popup .side-left {
          padding: 10px;
          background-color: #fee2e2;
          font-size: 25px;
          font-weight: bold;
          color: #dc2626;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    
        .popup h2 {
            font-size: 20px;
            margin: 0;
            color: #0f172a;
        }

        .popup-body p {
          line-height: 1.5;
          color: #475569;
        }

        .popup-body .body-button {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 20px;
        }
    
        .popup .close, .popup .delete-note-button {
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 200ms;
            font-size: 16px;
            font-weight: 600;
            padding: 8px 20px;
            text-decoration: none;
            color: #0f172a;
            cursor: pointer;
            border-radius: 5px;
        }

        .popup .close {
            background-color: #f0f2f5;
            border: 1px solid #e2e8f0;
        }

        .popup .delete-note-button {
            background-color: #dc2626;
            border: 1px solid #b91c1c;
            color: white;
        }
        
        .popup .close:active, .popup .delete-note-button:active {
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
      `;
    }

    render() {
        this._emptyContent();
        this._updateStyle();

        this._shadowRoot.appendChild(this._style);
        const statusText = this._note.archived ? "Archived" : "Active";
        const buttonIconName = this._note.archived
            ? "checkmark-circle-outline"
            : "archive";
        const buttonText = this._note.archived ? "Active" : "Archive";
        const buttonClass = this._note.archived
            ? "active-button"
            : "archive-button";

        this._shadowRoot.innerHTML += `
        <div class="note-item" key="${this._note.id}">
            <div class="tab">
                <div class="note-info">
                    <p class="date">${DateFormat(this._note.createdAt)}</p>
                  <p class="status ${statusText}">${statusText}</p>
                </div>
                <div class="tab-button__wrapper">
                    <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
                    <div class="tab-button">
                        <button class="delete-modal"><ion-icon name="trash"></ion-icon><span>Delete</span></button>
                        <button class="${buttonClass}"><ion-icon name="${buttonIconName}"></ion-icon><span>${buttonText}</span></button>
                    </div>
                </div>
                <div id="delete-popup-wrapper" class="overlay">
                  <div class="popup">
                      <div class="side-left"><ion-icon name="warning-outline" class="warning-icon"></ion-icon></div>
                      <div class="side-right">
                        <div class="popup-header">
                            <h2>Hapus Catatan</h2>
                        </div>
                        <div class="popup-body">
                            <p>Apakah anda yakin ingin menghapus catatan ini ?. Catatan akan dihapus secara permanen dan tidak dapat dikembalikan lagi.</p>
                            <div class="body-button">
                              <button class="close">Batal</button>
                              <button class="delete-note-button">Hapus</button>
                            </div>
                        </div>
                      </div>
                  </div>
              </div>
            </div>
            <h1 class="note-title">${this._note.title}</h1>
            <p class="note-description">${this._note.body}</p>
        </div>
    `;
    }

    addEventListeners() {
        const deleteModalButton =
            this._shadowRoot.querySelector(".delete-modal");
        const closeButton = this._shadowRoot.querySelector(".close");
        const deleteConfirmButton = this._shadowRoot.querySelector(
            ".delete-note-button"
        );
        const popupWrapper = this._shadowRoot.getElementById(
            "delete-popup-wrapper"
        );
        const noteListElement = document.querySelector("note-list");

        deleteModalButton.addEventListener("click", () => {
            popupWrapper.classList.add("active");
        });

        closeButton.addEventListener("click", () => {
            popupWrapper.classList.remove("active");
        });

        deleteConfirmButton.addEventListener("click", async () => {
            try {
                await deleteNote(this._note.id);
                Toast("Catatan berhasil dihapus", "#16a34a");
                this.remove();
                displayNotes(
                    noteListElement,
                    this._note.archived,
                    null,
                    getNotes,
                    getArchivedNotes
                );
                popupWrapper.classList.remove("active");
            } catch (error) {
                Toast("Gagal menghapus catatan", "#dc2626");
            }
        });

        this._shadowRoot.addEventListener("click", async (event) => {
            if (event.target.closest(".archive-button")) {
                try {
                    await archiveNote(this._note.id);
                    this._note.archived = true;
                    Toast("Catatan diarsipkan", "#f59e0b");
                    displayNotes(
                        noteListElement,
                        false,
                        null,
                        getNotes,
                        getArchivedNotes
                    );
                } catch (error) {
                    Toast("Gagal mengarsipkan catatan", "#dc2626");
                }
            } else if (event.target.closest(".active-button")) {
                try {
                    await unarchiveNote(this._note.id);
                    this._note.archived = false;
                    Toast("Catatan diaktifkan", "#16a34a");
                    displayNotes(
                        noteListElement,
                        true,
                        null,
                        getNotes,
                        getArchivedNotes
                    );
                } catch (error) {
                    Toast("Gagal mengaktifkan catatan", "#dc2626");
                }
            }
        });
    }
}

customElements.define("note-item", NoteItem);
