import axios from 'axios'

const baseUrl = 'http://localhost:5000/api/player'

const getPlayerMatches = async () => {
    try {
        const response = axios.get(`${baseUrl}/matches`, { withCredentials: true});
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
        const response = axios.get(`${baseUrl}/tournaments`, { withCredentials: true});
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
        const response = axios.get(`${baseUrl}/rating`)
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

const getPlayer = async () => {
    try {
        const response = axios.get(`${baseUrl}`)
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

export {getPlayerMatches, getPlayerTournaments, getPlayerRating, getPlayer}