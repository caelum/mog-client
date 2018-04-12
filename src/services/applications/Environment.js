

let baseURL = process.env.MOG_BACKEND_URL || 'http://localhost:8080';

console.log(baseURL);

export default class Mog {

    static backendURL(uri){
        if (uri.startsWith("/"))
            return baseURL + uri;
        else
            return baseURL + '/' + uri;
    }

}