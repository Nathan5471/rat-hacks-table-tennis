import express from 'express'
import authenticate from '../middleware/authenticate'
import { getPlayerTournaments, getPlayerMatches, getPlayerRating, getPlayer } from '../controllers/playerController'

const router = express.Router()

router.get('/tournaments', authenticate, async (req, res) => {
    try {
        getPlayerTournaments(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting tournaments' })
    }
})

router.get('/matches', authenticate, async (req, res) => {
    try {
        getPlayerMatches(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting matches'})
    }
})

router.get('/rating', authenticate, async (req, res) => {
    try {
        getPlayerRating(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting rating'})
    }
})

router.get('/', authenticate, async (req, res) => {
    try {
        getPlayer(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting player'})
    }
})

export default router