import express from 'express'
import { createTournament, addPlayerToTournament, removePlayerFromTournament, getTournament } from '../controllers/tournamentController'

router = express.Router()

router.post('/create', async (req, res) => {
    const { name, location, startDate } = req.body;
    try {
        if (!name || !location || !startDate) {
            return res.status(400).json({ message: 'All fields are required'})
        }
        createTournament(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error creating tournament'})
    }
})

router.post('/addPlayer', async (req, res) => {
    const { tournamentId, playerId } = req.body;
    try {
        if (!tournamentId || !playerId) {
            return res.status(400).json({ message: 'All fields are required'})
        }
        addPlayerToTournament(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error adding player to tournament'})
    }
})

router.post('/removePlayer', async (req, res) => {
    const { tournamentId, playerId } = req.body;
    try {
        if (!tournamentId || !playerId) {
            return res.status(400).json({ message: 'All fields are required'})
        }
        removePlayerFromTournament(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error removing player from tournament'})
    }
})

router.get('/:tournamentId', async (req, res) => {
    const { tournamentId } = req.params;
    try {
        if (!tournamentId) {
            return res.status(400).json({ message: 'Tournament ID is required'})
        }
        getTournament(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tournament details'})
    }
})

export default router