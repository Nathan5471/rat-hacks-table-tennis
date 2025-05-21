import axios from 'axios'

const baseUrl = 'https://a40a-184-170-66-25.ngrok-free.app/api/tournament'

const createTournament = async (tournamentInfo) => {
    try {
        const response = axios.post(`${baseUrl}/create`, tournamentInfo, { withCredentials: true})
        if (response.status === 201) {
            return response.data
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error("All fields are required")
        } else if (error.response.data.message === 'Player is not allowed to create tournament' && error.response.status === 401) {
            throw new Error("Player is not allowed to create tournaments")
        } else if (error.response && error.response.status === 401) {
            throw new Error("Player is not logged in")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Player not found")
        } else {
            console.error(error)
            throw new Error("Unkown error creating tournament")
        }
    }
}

const joinTournament = async (tournamentId) => {
    try {
        const response = axios.post(`${baseUrl}/addPlayer`, tournamentId, { withCredentials: true})
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error.response.data.message === 'All fields are required' && error.response.status === 400) {
            throw new Error("Tournament Id is required")
        } else if (error.response.data.message === 'Player already added to tournament' && error.response.status === 400) {
            return await leaveTournament(tournamentId)
        } else if (error.response && error.response.status === 401) {
            throw new Error("Player is not logged in")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Tournament or player not found")
        } else {
            console.error(error)
            throw new Error("Unkown error joining tournament")
        }
    }
}

const leaveTournament = async (tournamentId) => {
    try {
        const response = axios.post(`${baseUrl}/addPlayer`, tournamentId, { withCredentials: true})
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error.response.data.message === 'All fields are required' && error.response.status === 400) {
            throw new Error("Tournament Id is required")
        } else if (error.response.data.message === 'Player not in tournament' && error.response.status === 400) {
            return await joinTournament(tournamentId)
        } else if (error.response && error.response.status === 401) {
            throw new Error("Player is not logged in")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Tournament or player not found")
        } else {
            console.error(error)
            throw new Error("Unkown error leaving tournament")
        }
    }
}

const getTournament = async (tournamentId) => {
    try {
        const response = axios.get(`${baseUrl}/${tournamentId}`)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error.response &&  error.response.status === 400) {
            throw new Error("Tournament Id is required")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Tournament not found")
        } else {
            console.error(error)
            throw new Error("Unkown error getting tournament")
        }
    }
}

export {createTournament, joinTournament, leaveTournament, getTournament}