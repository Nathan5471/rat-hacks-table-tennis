import mongoose from 'mongoose';

const ratingHistorySchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    currentRating: {
        type: Number,
        required: true,
        default: 1000
    },
    previousRatings: [{
        date: {
            type: Date,
            default: Date.now
        },
        rating: {
            type: Number,
            required: true
        }
    }]
});

const RatingHistory = mongoose.model('RatingHistory', ratingHistorySchema);
export default RatingHistory;