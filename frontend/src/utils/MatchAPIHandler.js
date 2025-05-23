import axios from 'axios'

const baseUrl = 'https://ef42-184-170-66-25.ngrok-free.app/api/match'
const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})

const getMatch = async (matchId) => {
    try {
        const response = await api.get(`/${matchId}`, {headers: { 'ngrok-skip-browser-warning': 'any' }});
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error("Match Id is required")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Match not found")
        } else {
            console.error(error)
            throw new Error("Unknown error when getting match")
        }
    }
}

export {getMatch}