export class SocialService {
    
    constructor(http, apiUrl) {
        this.http = http;
        this.apiUrl = apiUrl;
    }

    async createComment(comment) {
        return await this.http.post(`${this.apiUrl}/social/comment`, comment);
    }

    async getCommentArticleById(articleId) {
        return await this.http.get(`${this.apiUrl}/social/comments/${articleId}`);
    }
}