import axios from 'axios'

const baseUrl = 'https://fe94-184-170-66-25.ngrok-free.app/api/auth';

const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})

const register = async (userInfo) => {
    try {
        const response = await api.post('/register', userInfo)
        if (response.status === 201) {
            return response.data
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error("All fields are required")
        } else if (error.response && error.response.status === 401) {
            throw new Error("Email already registered")
        } else {
            console.error(error)
            throw new Error("An unkown error occured during registering")
        }
    }
}

const login = async (loginInfo) => {
    try {
        const response = await api.post('/', loginInfo)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error("All fields are required")
        } else if (error.response && error.response.status === 401) {
            throw new Error("Invalid email or password")
        } else {
            console.error(error)
            throw new Error("An unkown error occured during login")
        }
    }
}

const isLoggedIn = async () => {
    try {
        const response = await api.get('/isLoggedIn', {headers: { 'ngrok-skip-browser-warning': 'any' }})
        if (response.status === 200) {
            return true
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return false
        } else {
            console.error(error)
            throw new Error("An unkown error occured while checking login status")
        }
    }
}

export {register, login, isLoggedIn}