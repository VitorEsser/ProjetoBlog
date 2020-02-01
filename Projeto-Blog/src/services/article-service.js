export class ArticleService {
    
    constructor(http, apiUrl) {
        this.http = http;
        this.apiUrl = apiUrl;
    }

    async createArticle(article) {
        return await this.http.post(`${this.apiUrl}/article`, article);
    }

    async getArticleRecent() {
        return await this.http.get(`${this.apiUrl}/article/recent`);
    }

    async getArticleById(id) {
        return await this.http.get(`${this.apiUrl}/article/${id}`);
    }

}
