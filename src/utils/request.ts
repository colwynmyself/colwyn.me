import fetch from 'isomorphic-fetch';

interface RequestObject {
    method: string;
    body?: string;
    headers?: any;
}

const checkResponse = res => {
    if (res.status >= 200 && res.status <= 299) {
        return res.status === 204 ? Promise.resolve() : res.json();
    } else {
        throw new Error(res.statusText);
    }
};

export const request = (url: string, method: string = 'GET', reqBody: any) => {
    const requestObject: RequestObject = {
        method,
    };

    if (method !== 'GET'){
        if (reqBody) {
            if (typeof reqBody !== 'string') {
                requestObject.body = JSON.stringify(reqBody);
            } else {
                requestObject.body = reqBody;
            }
        }
        requestObject.headers = {
            'Content-Type': 'application/json',
        };
    }

    return fetch(url, requestObject)
        .then(checkResponse);
};