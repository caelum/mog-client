import dotenv from 'dotenv';
dotenv.config();

const baseURL = process.env.REACT_APP_MOG_BACKEND_URL ||  'http://localhost:8080';

export default class Mog {

    static backendURL(uri){
        if (uri.startsWith("/"))
            return baseURL + uri;
        else
            return baseURL + '/' + uri;
    }

}