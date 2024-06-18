import { DateFormat } from "../utils/dateFormat.js";

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

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
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
        
        .delete-button, .archive-button, .active-button {
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
        
        .delete-button>span, .archive-button>span, .active-button>span {
            margin-left: 8px;
        }
        
        .delete-button {
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
        
        .delete-button:active, .archive-button:active, .active-button:active {
            transform: scale(.9);
        }
      `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    const statusText = this._note.archived ? "Archived" : "Active";
    const buttonIconName = this._note.archived ? "checkmark-circle-outline" : "archive";
    const buttonText = this._note.archived ? "Active" : "Archive";
    const buttonClass = this._note.archived ? "active-button" : "archive-button";

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
                        <button class="delete-button"><ion-icon name="trash"></ion-icon><span>Delete</span></button>
                        <button class="${buttonClass}"><ion-icon name="${buttonIconName}"></ion-icon><span>${buttonText}</span></button>
                    </div>
                </div>
            </div>
            <h1 class="note-title">${this._note.title}</h1>
            <p class="note-description">${this._note.body}</p>
        </div>
    `;
  }

  addEventListeners() {
    this._shadowRoot.addEventListener('click', (event) => {
      if (event.target.closest('.archive-button, .active-button')) {
        this._note.archived = !this._note.archived;
        this.render(); 
      }
    });
  }
}

customElements.define('note-item', NoteItem);
