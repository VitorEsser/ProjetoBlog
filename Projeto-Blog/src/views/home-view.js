import { LitElement, html, css } from "lit-element";
import {socialService, articleService, securityService} from '../blog-app'

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
                            </div>
                        </div>
                    `)}`
            : 
                html`Olá`
            }
                    
            `;
           
    };


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