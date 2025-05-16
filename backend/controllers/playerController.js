import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js'
import Player from '../models/player.js'

export const registerPlayer = async (req, res) => {
    const { fullName, email, password} = req.body;

    try {
        const existingEmail = await Player.findone({ email });
        if (existingEmail) {
            // TODO: Check and make sure this is the right error code
            return res.status(401).json({ message: 'Email already exists'});
        }

        // TODO: Add salting
        const hashedPassword = await bcrypt.hash(password, 10);

        const newPlayer = new Player({
            fullName,
            email,
            password: hashedPassword,
            tournaments: [],
            matches: []
        });

        await newPlayer.save()

        res.status(201).json({
            user: {
                _id: newUser._id,
                fullName,
                email
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error registering player'})
    }
}

export const loginPlayer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const player = await Player.findone({ email })
        if (!player) {
            return res.status(401).json({ message: 'Invalid email or password'})
        }
        const passwordsMatch = await bcrypt.compare(password, player.password)
        if (!passwordsMatch) {
            return res.status(401).json({ message: 'Invalid email or password'})
        }

        const token = generateToken(player._id)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        })
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.fullName,
                email: user.email
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error loggin in'})
    }
}

export const getPlayerTournaments = async (req, res) => {
    const playerId = req.playerId;
    try {
        const player = Player.findById(playerId)
        if (!player) {
            return res.status(404).json({ message: "Player not found" })
        }
        const tournaments = player.tournaments
        if (!tournaments) {
            return []
        }
        res.status(200).json({ tournaments })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error getting tournaments"})
    }
}

export const getPlayerMatches = async (req, res) => {
    const playerId = req.playerId;
    try {
        const player = Player.findById(playerId)
        if (!player) {
            return res.status(404).json({ message: "Player not found"})
        }
        const matches = player.matches
        if (!matches) {
            return []
        }
        res.status(200).json({ matches })
    } catch (error) {
        constole.error(error)
        res.status(500).json({ message: "Error getting matches"})
    }
}

export const getPlayerRating = async (req, res) => {
    const playerId = req.playerId;
    try {
        const player = Player.findById(playerId)
        if (!player) {
            return res.status(404).json({ message: "Player not found"})
        }
        const rating = player.matches
        if (!rating) {
            return res.status(404).json({ message: "Player does not have a rating"})
        }
        res.status(200).json({ rating })
    } catch (error) {
        constole.error(error)
        res.status(500).json({ message: "Error getting rating"})
    }
}