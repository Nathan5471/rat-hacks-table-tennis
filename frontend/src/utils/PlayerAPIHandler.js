import axios from 'axios'

const baseUrl = 'https://5084-24-149-102-194.ngrok-free.app/api/player'
const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})

const getPlayerMatches = async () => {
    try {
        const response = await api.get('/matches', { headers: { 'ngrok-skip-browser-warning': 'any' }});
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error("Player not logged in")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Player not found")
        } else {
            console.error(error)
            throw new Error("Unknown error getting player's matches")
        }
    }
}

const getPlayerTournaments = async () => {
    try {
        const response = await api.get('/tournaments', { headers: { 'ngrok-skip-browser-warning': 'any' }});
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error("Player not logged in")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Player not found")
        } else {
            console.error(error)
            throw new Error("Unknown error getting player's tournaments")
        }
    }
}

const getPlayerRating = async () => {
    try {
        const response = await api.get('/rating', { headers: { 'ngrok-skip-browser-warning': 'any' }})
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error("Player not logged in")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Player not found")
        } else {
            console.error(error)
            throw new Error("Unknown error getting player's rating")
        }
    }
}

const getTopRatings = async () => {
    try {
        const response = await api.get(`/topRatings`, { headers: { 'ngrok-skip-browser-warning': 'any' }})
        if (response.status === 200) {
            return response.data.topPlayers
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error("Player not logged in")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Player not found")
        } else {
            console.error(error)
            throw new Error("Unknown error getting top ratings")
        }
    }
}

const getPlayer = async () => {
    try {
        const response = await api.get('', { headers: { 'ngrok-skip-browser-warning': 'any' }})
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error("Player not logged in")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Player not found")
        } else {
            console.error(error)
            throw new Error("Unknown error getting player")
        }
    }
}

export {getPlayerMatches, getPlayerTournaments, getPlayerRating, getTopRatings, getPlayer}