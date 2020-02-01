import { LitElement, html, css } from "lit-element";
import '../components/text-input';
import '../components/password-input';
import '../components/dm-button';
import '../components/form-field';
import { router, securityService } from "../blog-app";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class LoginView extends LitElement {

    constructor() {
        super();
        this.invalidMessages = {};
        this.fields = {
            email: '',
            password: '',
        };

        this.submitted = false;
    }

    static get properties() {
        return {
            invalidMessages: { type: Object },
            fields: { type: Object },
            submitted: { type: Boolean } 
        }
    }

    static get styles() {
        return css`
            .container {
                max-width: 600px;
                width: 100%;
                margin:0  auto;
                padding: 60px 35px;  
                box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);
                background-color: #fff;
                min-height: 100vh;
            
            }
            .field-container {
                margin-bottom: 20px;
            }
            .view-title {
                text-align: center;
                margin: 0 0 40px 0;
            }

            .field-label {
                font-size: 15px;
                font-weight: bold;
            }
            .footer {
                text-align: right;
            }
            .cadastro {
                text-align: center;
                margin-top: 30px;
                font-size: 16px;
            }
            .cadastro > a {
                cursor: pointer;
                color: blue;
            }
        `;
    }

    render() {
        return html`
            <div class="container">
                <h2 class="view-title">Login</h2>

                <form-field title="E-mail" .errorMessage=${this.getInvalidMessage('email')}>
                    <text-input 
                        ?invalid=${this.isFieldInvalid('email')}   
                        .value="${this.fields.email}" 
                        @change="${this.handleChange('email')}">
                    </text-input>                
                </form-field>

                <form-field title="Senha" .errorMessage=${this.getInvalidMessage('password')}>
                    <password-input
                        ?invalid=${this.isFieldInvalid('password')}    
                        .value="${this.fields.password}" 
                        @change="${this.handleChange('password')}">
                    </password-input>                
                </form-field>
        
                <div class="footer">
                    <dm-button danger value="Cancelar" @click="${() => router.navigate("/home")}"></dm-button>
                    <dm-button primary value="Enviar" @click="${this.submit}"></dm-button>
                </div>
                <div class="cadastro">
                    Não tem uma conta? <a @click="${() => router.navigate("/cadastro")}">Cadastre-se!</a>
                </div>
            </div>
        `;
    }

    async submit() {
        this.submitted = true;
        this.validate();

        if(Object.keys(this.invalidMessages).length > 0) {    
            console.log('Invalid!', this.invalidMessages);
        } else {
            const user = {
                email: this.fields.email,
                password: this.fields.password,

            }

            try {
                await securityService.login(user);
                this.dispatchEvent(new CustomEvent("logged-in"));
                router.navigate('/home');
            } catch (e) {
                console.error("Erro ao criar usuário!", e);
                if(e.message == "User not found"){
                    this.invalidMessages = {email: "Usuário não encontrado."};
                }
            }
        }
    }

    validate() {
        const invalidMessages = {};

        const requiredValidation = (name) => {
            if(this.submitted && !this.fields[name]) {
                invalidMessages[name] = 'Este campo é obrigatório.'
                return false;
            }
            return true;
        }

        if(requiredValidation('email')) {
            if(this.fields.email && !emailRegex.test(this.fields.email)) {
                invalidMessages.email = 'E-mail inválido';
            }
        }
        requiredValidation('password');
        /* if(requiredValidation('password2')) {
            if(this.fields.password !== this.fields.password2) {
                invalidMessages.password2 =  'Senhas não conferem';
            }
        } */

        this.invalidMessages = invalidMessages;
    }

    getInvalidMessage(fieldName) {
       
        if(this.invalidMessages.hasOwnProperty(fieldName)) {
            return this.invalidMessages[fieldName];
        }
        return undefined;
    }


    isFieldInvalid(key) {
       
        if(this.invalidMessages.hasOwnProperty(key)) {
            return this.invalidMessages[key];
        }
        return undefined;
    }

    handleChange(field) {
        return (e) => {
            this.fields = {...this.fields, [field]: e.detail.value};
        }
    }

    updated(changedProperties) {
        if(changedProperties.has('fields') || changedProperties.has('submitted')) {
            this.validate();
        }
    }

}
window.customElements.define('login-view', LoginView);