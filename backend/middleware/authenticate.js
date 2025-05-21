import jwt from 'jsonwebtoken';
import Player from '../models/player.js';

export default function authenticate(req, res, next) {
    try {
        console.log("cookies:", req.cookies);
        console.log("token:", req.cookies.token);
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const player = Player.findById(decoded.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        req.playerId = decoded.id;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}