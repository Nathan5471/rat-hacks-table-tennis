import cron from 'node-cron';
import { startMatch } from '../controllers/matchController';
import Match from '../models/match';

const startMatches = async () => {
    try {
        const matches = await Match.find({ status: 'scheduled' });
        const currentDate = new Date();
        if (matches.length === 0) {
            return;
        }
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            if (match.date <= currentDate) {
                await startMatch(match._id);
                console.log("Starting match with id", match._id);
            }
        }
    } catch (error) {
        console.error("Error starting matches:", error);
    }
}

// Schedule the task to run every minute
cron.schedule('* * * * *', () => {
    console.log('Running start matches task...');
    startMatches();
    console.log('Start matches task completed.');
});