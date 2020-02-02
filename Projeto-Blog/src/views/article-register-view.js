import { LitElement, html, css } from "lit-element";
import { router,articleService } from "../blog-app";
import '../components/text-input';
import '../components/dm-button';
import '../components/form-field';
import '../components/textarea-input';

class ArticleRegisterView extends LitElement {

    constructor() {
        super();
        this.invalidMessages = {};
        this.fields = {
            title: '',
            content: ''
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
                <h2 class="view-title">Cadastro de Artigo</h2>

                <form-field title="Título" .errorMessage=${this.getInvalidMessage('title')}>
                    <text-input 
                        ?invalid=${this.isFieldInvalid('title')} 
                        .value="${this.fields.title}" 
                        @change="${this.handleChange('title')}">
                    </text-input>
                </form-field>

                <form-field title="Conteúdo" .errorMessage=${this.getInvalidMessage('content')}>
                    <textarea-input
                        ?invalid=${this.isFieldInvalid('content')}
                        .value="${this.fields.content}" 
                        @change="${this.handleChange('content')}"></textarea-input>
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

        const requiredValidation = (title) => {
            if(this.submitted && !this.fields[title]) {
                invalidMessages[title] = 'Este campo é obrigatório.'
                return false;
            }
            return true;
        }
        requiredValidation('title');
        requiredValidation('content');

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
            const article = {
                title: this.fields.title,
                content: this.fields.content
            }

            try {
                await articleService.createArticle(article);
                router.navigate('/home');
            } catch (e) {
                console.error("Erro ao criar artigo!", e);
            }
            
        }
    }

}

window.customElements.define('article-register-view', ArticleRegisterView);
