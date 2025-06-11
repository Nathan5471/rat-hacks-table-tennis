import axios from 'axios'

const baseUrl = 'https://kkkaic-ip-24-149-102-194.tunnelmole.net/api/tournament'
const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})

const createTournament = async (tournamentInfo) => {
    try {
        const response = await api.post('/create', tournamentInfo)
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
        const response = await api.post('/addPlayer', {tournamentId: tournamentId})
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
        const response = await api.post('/removePlayer', {tournamentId: tournamentId})
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
        const response = await api.get(`/${tournamentId}`)
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

const getTournaments = async () => {
    try {
        const response = await api.get('/all')
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error("Player is not logged in")
        } else if (error.response && error.response.status === 404) {
            throw new Error("Player not found")
        } else {
            console.error(error)
            throw new Error("Unkown error getting tournaments")
        }
    }
}

export {createTournament, joinTournament, leaveTournament, getTournament, getTournaments}