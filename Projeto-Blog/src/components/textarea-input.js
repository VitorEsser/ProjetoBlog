import { BaseInput } from "./base-input";
import { html } from "lit-element";

class TextAreaInput extends BaseInput {


    constructor() {
        super();
        this.value = '';
    }
    static get properties() {
        return {
            value: { type: String }
        }
    }
    render() {
        return html`
            <textarea
            class="input-default" .value=${this.value} @change=${this.handleChange}
            rows="10"
            ></textarea>
        `
    }

    handleChange(e) {
        super.dispatchChangeEvent(e.target.value);
    }


}

window.customElements.define('textarea-input', TextAreaInput);
