import axios from "axios";
import localforage from "localforage";

const getToken = async () => {
    return await localforage.getItem('token');
}

const instance = axios.create({
    baseURL: 'https://localhost:44306/v1/',
    timeout: 1000,
    headers: {'Authorization': `Bearer ${getToken()}`}
});

export default instance;