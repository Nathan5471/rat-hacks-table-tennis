import express from 'express'
import authenticate from '../middleware/authenticate.js'
import { getPlayerTournaments, getPlayerMatches, getPlayerRecentMatches, getPlayerRating, getPlayerRatingHistory, getTopRatings, getPlayer } from '../controllers/playerController.js'

const router = express.Router()

router.get('/tournaments', authenticate, async (req, res) => {
    try {
        getPlayerTournaments(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting tournaments' })
    }
})

router.get('/:id/tournaments', authenticate, async (req, res) => {
    try {
        getPlayerTournaments(req, res)
    }
    catch (error) {
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

router.get('/recentMatches', authenticate, async (req, res) => {
    try {
        getPlayerRecentMatches(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting recent matches'})
    }
})

router.get('/:id/recentMatches', authenticate, async (req, res) => {
    try {
        getPlayerRecentMatches(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting recent matches'})
    }
})

router.get('/rating', authenticate, async (req, res) => {
    try {
        getPlayerRating(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting rating'})
    }
})

router.get('/ratingHistory', authenticate, async (req, res) => {
    try {
        getPlayerRatingHistory(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting rating history'})
    }
})

router.get('/:id/ratingHistory', authenticate, async (req, res) => {
    try {
        getPlayerRatingHistory(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting rating history'})
    }
})

router.get('/topRatings', async (req, res) => {
    try {
        getTopRatings(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting top ratings'})
    }
})

router.get('/', authenticate, async (req, res) => {
    try {
        getPlayer(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting player'})
    }
})

router.get('/:id', authenticate, async (req, res) => {
    try {
        getPlayer(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error getting player'})
    }
})

export default router