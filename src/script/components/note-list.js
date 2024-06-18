class NoteList extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._style = document.createElement("style");

      this.render();
  }

  hideLoading() {
      const loadingElement = this._shadowRoot.querySelector(".loading");
      if (loadingElement) {
          loadingElement.remove();
      }
  }

  showLoading() {
      const loadingElement = document.createElement("div");
      loadingElement.classList.add("loading");
      this._shadowRoot
          .querySelector(".note-list")
          .appendChild(loadingElement);
  }

  _updateStyle() {
      this._style.textContent = `
    :host {
      display: block;
    }

    .note-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
      margin-top: 20px;
      margin-bottom: 50px;
    }

    .loading {
      width: 60px;
      margin: 0 auto;
      aspect-ratio: 2;
      --_g: no-repeat radial-gradient(circle closest-side,#000 90%,#0000);
      background: 
        var(--_g) 0%   50%,
        var(--_g) 50%  50%,
        var(--_g) 100% 50%;
      background-size: calc(100%/3) 50%;
      animation: l3 1s infinite linear;
    }

    @keyframes l3 {
        20%{background-position:0%   0%, 50%  50%,100%  50%}
        40%{background-position:0% 100%, 50%   0%,100%  50%}
        60%{background-position:0%  50%, 50% 100%,100%   0%}
        80%{background-position:0%  50%, 50%  50%,100% 100%}
    }

    @media screen and (max-width: 480px) {
      .note-list {
        margin-bottom: 100px;
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
    <div class="note-list">
      <slot></slot>
      <div class="loading"></div>
    </div>
  `;
  }
}

customElements.define("note-list", NoteList);
