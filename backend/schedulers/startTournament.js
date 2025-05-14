import cron from 'node-cron'
import { startTournament } from '../controllers/tournamentController'
import Tournament from '../models/tournament'

const startTournaments = async () => {
    const upcomingTournaments = Tournament.find({ status: 'upcoming'})
    const currentDate = new Date()
    if ( upcomingTournaments.length === 0 ) {
        return;
    }
    for (let i = 0; i < upcomingTournaments.length; i++ ) {
        const tournament = upcomingTournaments[i]
        if (tournament.startDate === currentDate) {
            await startTournament(tournament._id)
            console.log("Starting tournament with id", tournament._id)
        }
    }
}

// Schedule the task to run every minute
cron.schedule('* * * * *', () => {
    console.log('Running start tournaments task...');
    startTournaments();
    console.log('Start tournaments task completed.');
});