import jwt from 'jsonwebtoken';
import { Player } from '../models/player';

export default function authenticate(req, res, next) {
    try {
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
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}