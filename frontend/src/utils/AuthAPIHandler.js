import axios from 'axios'

const baseUrl = 'http://localhost:5000/api/auth';

const register = async (userInfo) => {
    try {
        const response = axios.post(`${baseUrl}/register`, userInfo)
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
        const response = axios.post(baseUrl, loginInfo)
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

export {register, login}