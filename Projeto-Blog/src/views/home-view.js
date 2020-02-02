import { LitElement, html, css } from "lit-element";
import {socialService, articleService, securityService, router} from '../blog-app'

class HomeView extends LitElement {

    constructor(){
        super();
        this.articles = [];
        this.logged = false;
        this.user;
    }

    static get properties() {
        return {
            articles: { type: Array },
            logged: { type: Boolean },
            user: { type: Object },
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
            }
            .post-content {
                margin-top: 30px;
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
        `;
    }

    render() {
        
        return html`
            ${ this.logged
            ? 
                html`
                    ${this.articles.map(article =>
                        html`
                        <div class="post">
                            <div class="post-title">
                                ${article.title}
                            </div>
                            <div class="post-content">
                                ${article.content}
                                ...<a @click="${() => router.navigate(`/article/${article.id}`, article.id)}">Ver mais</a> 
                            </div>
                            <div class="footer-article">
                                <div> <b>Autor: </b> ${article.author} </div>
                                <div> <b>Data: </b> ${this.getDate(article.creationDate)} </div> 
                            </div>
                        </div>
                    `)}`
            : 
                html`Olá`
            }
                    
            `;
           
    };

    getDate(dateTimeStamp){
        var date = new Date(dateTimeStamp);
        return date.toLocaleDateString("pt-BR");
    }

    async init(){
        this.articles = await articleService.getArticleRecent();
    }

    async isAuthenticated(){
        try {
            this.user = await securityService.getUser();
            this.logged = true;
        } catch (e) {
            this.logged = false;
        }
        
    }

    async firstUpdated() {
        await this.init();
        await this.isAuthenticated();
    }
    
}
window.customElements.define('home-view', HomeView);