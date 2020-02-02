import { LitElement, html,css } from "lit-element";
import {socialService, articleService, securityService} from '../blog-app'

class ArticleShowView extends LitElement {

    constructor() {
        super();
        this.articleId;
        this.article = {};
    }

    static get properties() {
        return {
            articleId: { type: Number},
            article: { type: Object },
        }
    }
    
    static get styles() {
        return css `
            .post{
                max-width: 700px;
                width: 100%;
                height: 500px;
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
            .post-content > a {
                font-size: 15px;
                cursor: pointer;
                color: blue;
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
            </div>               
        `
    };

    async firstUpdated() {
        this.article = await articleService.getArticleById(this.articleId);
        console.log(this.article);
    }
}

window.customElements.define('article-show-view', ArticleShowView);