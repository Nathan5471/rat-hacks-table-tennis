import express from 'express';
import { getMatchDetails } from '../controllers/matchController';

const router = express.Router();

router.get('/:matchId', async (req, res) => {
    const { matchId } = req.params;
    try {
        if (!matchId) {
            return res.status(400).json({ message: 'Match ID is required' });
        }
        const matchDetails = await getMatchDetails(matchId);
        if (!matchDetails) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.status(200).json(matchDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching match details' });
    }
})

export default router;