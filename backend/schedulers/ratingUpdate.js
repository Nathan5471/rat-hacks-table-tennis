import cron from 'node-cron';
import RatingHistory from '../models/ratingHistory';

const updateRating = async () => {
    try {
        const players = await RatingHistory.find({});

        players.forEach(async (player) => {
            const currentDate = new Date();
            const newRating = player.currentRating
            const previousRatings = player.previousRatings || [];
            previousRatings.push({
                date: currentDate,
                rating: newRating
            });
            await RatingHistory.updateOne(
                { _id: player._id },
                {
                    $set: { currentRating: newRating },
                    $set: { previousRatings: previousRatings }
                }
            )
        });
    } catch (error) {
        console.error('Error updating ratings:', error);
    }
}

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running rating update task...');
    updateRating();
    console.log('Rating update task completed.');
});
