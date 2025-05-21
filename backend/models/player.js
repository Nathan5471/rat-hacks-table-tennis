import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ['user', 'organizer', 'admin'],
        default: 'user',
        required: true
    },
    tournaments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament'
    }],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
    rating: {
        type: Number,
        default: 1000
    },
});

const Player = mongoose.model('Player', playerSchema);
export default Player;