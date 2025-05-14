import Tournament from "../models/tournament";
import Match from "../models/match";
import Player from "../models/player";
import matchController from "./matchController";
import generateBracket from "../utils/bracketGenerator";

export const createTournament = async (req, res) => {
    const { name, location, startDate, format } = req.body;
    try {
        const tournament = new Tournament({
            name,
            location,
            startDate,
            status: "upcoming",
            format
        })
        await tournament.save();
        res.status(201).json({ message: 'Tournament created successfully', tournament });
    } catch (error) {
        console.error('Error creating tournament:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const addPlayerToTournament = async (req, res) => {
    const { tournamentId, playerId } = req.body;
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        if (tournament.playerIds.includes(playerId)) {
            return res.status(400).json({ message: 'Player already added to tournament' });
        }

        tournament.playerIds.push(playerId);
        await tournament.save();

        player.tournaments.push(tournamentId);
        await player.save();

        res.status(200).json({ message: 'Player added to tournament successfully', tournament });
    } catch (error) {
        console.error('Error adding players to tournament:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const removePlayerFromTournament = async (req, res) => {
    const { tournamentId, playerId } = req.body;
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        if (!tournament.playerIds.includes(playerId)) {
            return res.status(400).json({ message: 'Player not in tournament' });
        }

        tournament.playerIds.pull(playerId);
        await tournament.save();

        player.tournaments.pull(tournamentId);
        await player.save();

        res.status(200).json({ message: 'Player removed from tournament successfully', tournament });
    } catch (error) {
        console.error('Error removing players from tournament:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const startTournament = async (tournamentId) => {
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            throw new Error('Tournament not found');
        }
        if (tournament.status !== 'upcoming') {
            throw new Error('Tournament already started or completed');
        }
        tournament.status = 'ongoing';
        
        const players = await Player.find({ _id: { $in: tournament.playerIds } });
        if (players.length < 2) {
            throw new Error('Not enough players to start the tournament');
        }

        const bracket = generateBracket(players, tournament.format, tournamentId, tournament.startDate, tournament.location);
        
    } catch (error) {
        console.error('Error starting tournament:', error)
    }
}