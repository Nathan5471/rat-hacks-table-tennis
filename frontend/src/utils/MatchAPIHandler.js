import axios from 'axios'

const baseUrl = 'https://dd0b-24-149-102-194.ngrok-free.app/api/match'

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

export {getMatch}