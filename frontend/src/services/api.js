import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { StorageService } from './storage.js'

axios.defaults.baseURL = process.env.VUE_APP_API_PATH;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// If token exists set header
let token = StorageService.getToken();
if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

export const ApiService = {
    init() {
        setupCache(axios, { interpretHeader: false });
    },
    removeHeader() {
        axios.defaults.headers.common = {}
    },
    get(apiPath, options = { cache:  false}) {
        return axios.get(apiPath, options)
    },
    download(apiPath) {
        return axios({
            url: apiPath,
            method: 'GET',
            responseType: 'blob', // important
        })
    },
    post(apiPath, data) {
        return axios.post(apiPath, data);
    },

    put(apiPath, data) {
        return axios.put(apiPath, data)
    },

    delete(apiPath) {
        return axios.delete(apiPath)
    },
    axios() {
        return axios;
    },
}
