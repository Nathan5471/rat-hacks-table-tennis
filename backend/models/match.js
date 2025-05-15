import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    player1Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    player2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    winnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        default: null
    },
    scores: {
        player1: [{
            type: Number,
            required: true
        }],
        player2: [{
            type: Number,
            required: true
        }]
    },
    date: {
        type: Date,
        default: null
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['un-scheduled', 'scheduled', 'in-progress', 'completed'],
        default: 'un-scheduled'
    }
});

const Match = mongoose.model('Match', matchSchema);
export default Match;