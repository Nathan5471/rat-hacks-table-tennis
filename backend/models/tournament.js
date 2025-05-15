import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    playerIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    },
    bracket: [{
        roundNumber: {
            type: Number,
            required: true
        },
        matches: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Match'
        }],
        byes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }]
    }]
});

const Tournament = mongoose.model('Tournament', tournamentSchema);
export default Tournament;