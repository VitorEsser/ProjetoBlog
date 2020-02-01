export class SecurityService {
    
    constructor(http, apiUrl) {
        this.http = http;
        this.apiUrl = apiUrl;
    }

    async createUser(user) {
        return await this.http.post(`${this.apiUrl}/security/user`, user);
    }

    async getUser() {
        return await this.http.get(`${this.apiUrl}/security/user`);
    }

    async login(user) {
        return await this.http.post(`${this.apiUrl}/security/login`, user);
    }

    async logout() {
        return await this.http.get(`${this.apiUrl}/security/logout`);
    }
    
}
