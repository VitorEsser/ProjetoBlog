export class HttpProvider {


    async get(url, options = {}) {
        return await this.processResponse(await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            ...options
        }));
    }

    async post(url, data, options = {}) {
        return await this.processResponse(await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify(data),
            ...options
        }));
    }

    async processResponse(response) {
        console.log(response);
        switch (response.status) {
            case 200:
                return await response.json();
            case 201:
            case 204:
                return;
            default:
                let errorMessage = null;
                
                if(response.headers.get('content-type') === 'application/json') {
                    const error = await response.json();
                    errorMessage = error.message;

                }
                throw {
                    status: response.status,
                    message: errorMessage || await response.text()
                }

        }
    }
}
