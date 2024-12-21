import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
    withCredentials: true
})

const UseAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useContext(AuthContext);


    useEffect(() => {
        axiosSecure.interceptors.response.use(res => {
            return res;
        }, async (error) => {
            console.log('error caught from our interceptor--->', error.response)
            if (error.response.status === 401 || error.response.status === 403) {
                // logout
                logOut();
                // navigate to login
                navigate('/login');
            }
        }
        )
    }, [logOut, navigate])

    return axiosSecure;
}
export default UseAxiosSecure;