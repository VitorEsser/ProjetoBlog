import { LitElement, html, css } from "lit-element";
import { router,securityService } from "../blog-app";
import '../components/text-input';
import '../components/password-input';
import '../components/dm-button';
import '../components/dm-checkbox';
import '../components/form-field';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class UserRegisterView extends LitElement {

    constructor() {
        super();
        this.invalidMessages = {};
        this.fields = {
            name: '',
            surname: '',
            email: '',
            password: '',
            password2: '',
            terms: false
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
        `;
    }

    render() {
        return html`
            <div class="container">
                <h2 class="view-title">Cadastro de Usuário</h2>

                <form-field title="Nome" .errorMessage=${this.getInvalidMessage('name')}>
                    <text-input 
                        ?invalid=${this.isFieldInvalid('name')} 
                        .value="${this.fields.name}" 
                        @change="${this.handleChange('name')}">
                    </text-input>
                </form-field>

                <form-field title="Sobrenome" .errorMessage=${this.getInvalidMessage('surname')}>
                    <text-input 
                        ?invalid=${this.isFieldInvalid('surname')}  
                        .value="${this.fields.surname}" 
                        @change="${this.handleChange('surname')}">
                    </text-input>                
                </form-field>

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
           
                <form-field title="Confirmar Senha" .errorMessage=${this.getInvalidMessage('password2')}>
                    <password-input
                        ?invalid=${this.isFieldInvalid('password2')}     
                        .value="${this.fields.password2}" 
                        @change="${this.handleChange('password2')}">
                    </password-input>               
                 </form-field>

                 <form-field .errorMessage=${this.getInvalidMessage('terms')}>
                    <dm-checkbox
                        label="Aceito os termos e condições."
                        ?invalid=${this.isFieldInvalid('terms')}     
                        .checked="${this.fields.terms}" 
                        @change="${this.handleChange('terms')}">
                    </dm-checkbox>               
                 </form-field>
                 <div class="footer">
                    <dm-button danger value="Cancelar" @click="${() => router.navigate("/home")}"></dm-button>
                    <dm-button primary value="Enviar" @click="${this.submit}"></dm-button>
                </div>
            </div>
        `;
    }

    
    validate() {
        const invalidMessages = {};

        const requiredValidation = (email) => {
            if(this.submitted && !this.fields[email]) {
                invalidMessages[email] = 'Este campo é obrigatório.'
                return false;
            }
            return true;
        }
        requiredValidation('name');
        requiredValidation('surname');
        if(requiredValidation('email')) {
            if(this.fields.email && !emailRegex.test(this.fields.email)) {
                invalidMessages.email = 'E-mail inválido';
            }
        }
        requiredValidation('password');
        if(requiredValidation('password2')) {
            if(this.fields.password !== this.fields.password2) {
                invalidMessages.password2 =  'Senhas não conferem';
            }
        }

        if(this.submitted && !this.fields.terms) {
            invalidMessages.terms = "Você deve aceitar os termos de uso para continuar."
        }

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

    async submit() {
        this.submitted = true;
        this.validate();
        
        if(Object.keys(this.invalidMessages).length > 0) {    
            console.log('Invalid!', this.invalidMessages);
        } else {
            const user = {
                name: this.fields.name + ' ' + this.fields.surname,
                email: this.fields.email,
                password: this.fields.password,
            }

            try {
                await securityService.createUser(user);
                router.navigate('/login');
            } catch (e) {
                console.error("Erro ao criar usuário!", e);
            }
            
        }
    }

}

window.customElements.define('user-register-view', UserRegisterView);
