import axios from 'axios'

const baseUrl = 'https://ef42-184-170-66-25.ngrok-free.app/api/player'
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

const getPlayerRecentMatches = async (playerId = undefined) => {
    try {
        let response;
        if (playerId === undefined) {
            response = await api.get('/recentMatches', { headers: { 'ngrok-skip-browser-warning': 'any' }});
        } else {
            response = await api.get(`/recentMatches/${playerId}`, { headers: { 'ngrok-skip-browser-warning': 'any' }});
        }
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
            throw new Error("Unknown error getting player's recent matches")
        }
    }
}

const getPlayerTournaments = async (playerId = undefined) => {
    try {
        let response;
        if (playerId === undefined) {
            response = await api.get('/tournaments', { headers: { 'ngrok-skip-browser-warning': 'any' }});
        } else {
            response = await api.get(`/tournaments/${playerId}`, { headers: { 'ngrok-skip-browser-warning': 'any' }});
        }
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

const getPlayerRatingHistory = async (playerId = undefined) => {
    try {
        let response;
        if (playerId === undefined) {
            response = await api.get('/ratingHistory', { headers: { 'ngrok-skip-browser-warning': 'any' }})
        } else {
            response = await api.get(`/ratingHistory/${playerId}`, { headers: { 'ngrok-skip-browser-warning': 'any' }})
        }
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
            throw new Error("Unknown error getting player's rating history")
        }
    }
}

const getPlayerSelf = async () => {
    try {
        const response = await api.get('/', { headers: { 'ngrok-skip-browser-warning': 'any' }})
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

const getPlayer = async (id) => {
    try {
        const response = await api.get(`/${id}`, { headers: { 'ngrok-skip-browser-warning': 'any' }})
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

export {getPlayerMatches, getPlayerRecentMatches, getPlayerTournaments, getPlayerRating, getPlayerRatingHistory, getTopRatings, getPlayerSelf, getPlayer}