import { LitElement, html } from "lit-element";

class PostView extends LitElement {

    render() {
        return html `Olá`;
    }
}

window.customElements.define('post-view', PostView);