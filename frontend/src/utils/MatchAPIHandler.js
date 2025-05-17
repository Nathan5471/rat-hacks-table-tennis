import axios from 'axios'

const baseUrl = 'http://localhost:5000/api/match'
const playerUrl = 'http://localhost:5000/api/player'

const getMatch = async (matchId) => {
    try {
        const response = axios.get(`${baseUrl}/${matchId}`);
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

const getPlayerMatches = async () => {
    try {
        const response = axios.get(`${playerUrl}/matches`, { withCredentials: true});
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

export {getMatch, getPlayerMatches}