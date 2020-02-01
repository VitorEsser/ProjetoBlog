import { LitElement, html, css } from 'lit-element';

class DmButton extends LitElement {

    constructor() {
        super();
    }

    static get properties() {
        return {
            value: { type: String }
        }
    }

    static get styles() {
        return css`
            :host {
                background-image: none;
                border: 1px solid;
                border-color: transparent;
                cursor: pointer;
                display: inline-block;
                font-weight: bold;
                padding: 5px 10px;
                font-size: 14px;
                line-height: 22px;
                border-radius: 2px;
                text-align: center;
                transition: none !important;
                touch-action: manipulation;
                vertical-align: middle;
                white-space: nowrap;
                user-select: none;
            }
            :host([primary])  {
                color: #ffffff;
                background-color: #0086c7;
            }  
            :host([primary]:hover)  {
                background-color: #0173aa !important;
            }
            :host([danger])  {
                background-color: #fe6b6b;
                color: #fff;
            }
            :host([danger]:hover)  {
                background-color: #d74f4f !important;
            }
        `;
    }

    render() {
        return html`
           ${this.value}
        `;
    }

}


window.customElements.define('dm-button', DmButton);
