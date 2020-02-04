import { LitElement, html,css } from "lit-element";
import {socialService, articleService, securityService} from '../blog-app';
import '../components/form-field';
import '../components/textarea-input';
import '../components/dm-button';

class ArticleShowView extends LitElement {

    constructor() {
        super();
        this.articleId;
        this.article = {};
        this.comments = [];
        this.logado = true;
        this.invalidMessages = {};
        this.fields = {
            comment: '',
        };

        this.submitted = false;
    }

    static get properties() {
        return {
            comments: { type: Array },
            articleId: { type: Number},
            article: { type: Object },
            logado: { type: Boolean },
            invalidMessages: { type: Object },
            fields: { type: Object },
            submitted: { type: Boolean }
        }
    }
    
    static get styles() {
        return css `
            .post{
                max-width: 700px;
                width: 100%;
                margin: 0 auto;
                margin-bottom: 30px;
                border: 1px solid black;
                background-color: #fff;
                padding: 10px;
            }

            .post-title{    
                text-align: center;
                padding: 20px;
                font-weight: bold;
                font-size: 28px;
                word-wrap: break-word;
            }
            .post-content {
                margin-top: 30px;
                word-wrap: break-word;
            }
            .post-content > a {
                font-size: 15px;
                cursor: pointer;
                color: blue;
            }
            .footer-article {
                margin-top: 50px;
                border: 1px solid black;
                padding: 4px;
                border-radius: 10px;
                justify-content: space-between;
                display: flex;
            }
            .comentarios {
                max-width: 700px;
                width: 100%;
                margin: 0 auto;
                margin-top: 50px;
                font-size: 17px;
            }
            .comentario {
                max-width: 600px;
                width: 100%;
                margin: 0 auto;
                margin-bottom: 30px;
                border: 1px solid black;
                border-radius: 20px;
                background-color: yellow;
                padding: 5px;
            }
            .comentario-autor {
                text-align: right;
                padding: 2px;
                font-weight: bold;
                font-size: 15px;
                word-wrap: break-word;
            }
            .comentario-comentario {
                padding: 5px;
                font-size: 18px;
                word-wrap: break-word;
            }
            .footer {
                text-align: right;
                margin-bottom: 30px;
            }

        `;
    }

    render() {
        
        return html`
            <div class="post">
                <div class="post-title">
                    ${this.article.title}
                </div>
                <div class="post-content">
                    ${this.article.content}
                </div>
                <div class="footer-article">
                    <div> <b>Autor: </b> ${this.article.author} </div>
                    <div> <b>Data: </b> ${this.getDate(this.article.creationDate)} </div> 
                </div>
            </div>
            
            <div class="comentarios">
                <b>Comentários:</b>
                <hr>
                ${ this.logado
                ? 
                    html`
                        ${this.comments.map(comment =>
                            html`
                            <div class="comentario">
                                <div class="comentario-comentario">
                                    "${comment.comment}"
                                </div>
                                <div class="comentario-autor">
                                    - ${comment.author}, ${this.getDate(comment.creationDate)} 
                                </div>
                            </div>
                        `)}`
                : 
                    html`Entre com sua conta para poder criar e ver os comentários!`
                }
            </div>
            <div class="comentarios">
                <hr>
                <form-field title="Comente aqui" .errorMessage=${this.getInvalidMessage('comment')}>
                    <textarea-input
                        ?invalid=${this.isFieldInvalid('comment')}
                        .value="${this.fields.comment}" 
                        @change="${this.handleChange('comment')}"></textarea-input>
                </form-field>
                 <div class="footer">
                    <dm-button primary value="Enviar" @click="${this.submit}"></dm-button>
                </div>
            </div>            
        `
    };

    validate() {
        const invalidMessages = {};

        const requiredValidation = (comment) => {
            if(this.submitted && !this.fields[comment]) {
                invalidMessages[comment] = 'Este campo é obrigatório.'
                return false;
            }
            return true;
        }
        requiredValidation('comment');

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
            this.getComments(this.articleId);
        }
    }

    async submit() {

        this.submitted = true;
        this.validate();
        
        if(Object.keys(this.invalidMessages).length > 0) {    
            console.log('Invalid!', this.invalidMessages);
        } else {
            const comentario = {
                articleId: this.articleId,
                comment: this.fields.comment
            }

            try {
                await socialService.createComment(comentario);
            } catch (e) {
                console.error("Erro ao criar comentário!", e);
            }
            
        }
        this.fields.comment = '';
    }

    getDate(dateTimeStamp){
        var date = new Date(dateTimeStamp);
        return date.toLocaleDateString("pt-BR");
    }
    async getComments(id) {
        this.comments = await socialService.getCommentArticleById(id);
    }

    async firstUpdated() {
        this.article = await articleService.getArticleById(this.articleId);
        await this.getComments(this.articleId);
    }
}

window.customElements.define('article-show-view', ArticleShowView);