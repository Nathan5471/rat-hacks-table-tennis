import express from 'express'
import { registerPlayer, loginPlayer } from '../controllers/playerController.js'

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

export default router