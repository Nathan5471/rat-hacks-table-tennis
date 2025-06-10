import express from 'express'
import authenticate from '../middleware/authenticate.js'
import { createTournament, getAllTournaments, addPlayerToTournament, removePlayerFromTournament, getTournament } from '../controllers/tournamentController.js'

const router = express.Router()

router.post('/create', authenticate, async (req, res) => {
    const { name, location, startDate, timeBetweenMatch } = req.body;
    try {
        if (!name || !location || !startDate || !timeBetweenMatch) {
            return res.status(400).json({ message: 'All fields are required'})
        }
        createTournament(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error creating tournament'})
    }
})

router.get('/all', authenticate, async (req, res) => {
    try {
        getAllTournaments(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tournaments'})
    }
})

router.post('/addPlayer', authenticate, async (req, res) => {
    const { tournamentId } = req.body;
    try {
        if (!tournamentId) {
            return res.status(400).json({ message: 'All fields are required'})
        }
        addPlayerToTournament(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error adding player to tournament'})
    }
})

router.post('/removePlayer', authenticate, async (req, res) => {
    const { tournamentId } = req.body;
    try {
        if (!tournamentId) {
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