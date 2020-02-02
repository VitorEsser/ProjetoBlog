import { LitElement, html } from "lit-element";
import Navigo from 'navigo';
import './components/menu-bar';
import './components/menu-item';
import { HttpProvider } from './services/http-provider';
import { SecurityService } from './services/security-service'
import { ArticleService } from './services/article-service'
import { SocialService } from './services/social-service'

const apiUrl = "http://127.0.0.1:8080/";
const httpProvider = new HttpProvider();
export const securityService = new SecurityService(httpProvider, apiUrl);
export const articleService = new ArticleService(httpProvider, apiUrl);
export const socialService = new SocialService(httpProvider, apiUrl);

export const router = new Navigo('/', true, '#');

class BlogApp extends LitElement {

    constructor(){
        super();
        this.logged = false;
        this.user;

        router.on('home', async () => {
            this.route = 'home';
            await import('./views/home-view');
            this.currentRoute = html`<home-view></home-view>`;
        })
        .on('login', async () => {
            this.route = 'login';
            await import('./views/login-view');
            this.currentRoute = html`<login-view @logged-in=${() => this.logged = true}></login-view>`;
        })
        .on('cadastro', async () => {
            this.route = 'cadastro';
            await import('./views/user-register-view');
            this.currentRoute = html`<user-register-view></user-register-view>`; 
        })
        .on('article/:id', async(params) => {
            await import('./views/article-show-view');
            this.currentRoute = html`<article-show-view articleId="${params.id}"></article-show-view>`; 
        })
        .on('cadastro-artigo', async () => {
            this.route = 'cadastro-artigo';
            await import('./views/article-register-view');
            this.currentRoute = html`<article-register-view></article-register-view>`;
        })
        .notFound(() => {
            this.route = 'not found';
        })
        .on('', () =>{
            router.navigate('/home')
        })
        
        .resolve();
    }

    static get properties() {
        return {
            route: { type: String },
            currentRoute: { type: Object },
            logged: { type: Boolean },
            user: { type: Object },
        }
    }
    

    render() {
        return html`
            <menu-bar>
                <div slot="left">
                    <menu-item ?active=${this.route === 'home'} @click=${() => router.navigate("/home")}>Home</menu-item>
                    ${this.logged
                    ? html`
                    <menu-item @click=${() => router.navigate("/cadastro-artigo")}>Criar Artigo</menu-item>
                    `: html ``
                    }
                </div> 
                <div slot="right">
                    ${this.logged
                    ? html`
                    <menu-item @click=${this.logout}>Logout</menu-item>
                    `: html `
                    <menu-item ?active=${this.route === 'login'}  @click=${() => router.navigate("/login")}>Login</menu-item>
                    `
                    }
                </div>  
            </menu-bar>

            <div> 
                ${this.currentRoute}
            </div>

        `;
    }

    async logout() {
        await securityService.logout();
        this.logged = false;
        router.navigate('/login');
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
        await this.isAuthenticated();
    }
    
}

window.customElements.define('blog-app', BlogApp)