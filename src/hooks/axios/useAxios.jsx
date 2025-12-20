import axios from "axios";

const instance = axios.create({
    baseURL: "https://contesthub-server-dun.vercel.app/",
})
const useAxios = () => {
    return instance;
}

export default useAxios;