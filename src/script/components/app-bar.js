class AppBar extends HTMLElement {
    _shadowRoot = null;
    _style = null;

    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._style = document.createElement("style");
    }

    _updateStyle() {
        this._style.textContent = `
        h1 {
            margin: 0;
        }
      `;
    }

    _emptyContent() {
        this._shadowRoot.innerHTML = "";
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this._emptyContent();
        this._updateStyle();

        this._shadowRoot.appendChild(this._style);
        this._shadowRoot.innerHTML += `      
        <div>
            <h1>Notes App</h1>
        </div>
      `;
    }
}

customElements.define("app-bar", AppBar);
