import express from 'express'
import { registerPlayer, loginPlayer } from '../controllers/playerController.js'
import authenticate from '../middleware/authenticate.js'
import Player from '../models/player.js'

const router = express.Router()

router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required'})
        }
        registerPlayer(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error registering player'})
    }
})

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required'})
        }
        loginPlayer(req, res)
    } catch (error) {
        res.status(500).json({ message: 'Error logging in player'})
    }
})

router.post('/isLoggedIn', authenticate, async (req, res) => {
    try {
        const player = await Player.findById(req.playerId)
        if (!player) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        res.status(200).json({ message: 'Logged in', player })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error checking login status' })
    }
})

export default router