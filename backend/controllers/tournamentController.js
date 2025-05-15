import Tournament from "../models/tournament.js";
import Match from "../models/match.js";
import Player from "../models/player.js";
import { createMatch, setMatchDate, startMatch, endMatch } from "./matchController.js";
import generateBracket from "../utils/bracketGenerator.js";
import generateNextRound from "../utils/bracketNextRoundGenerator.js";

export const createTournament = async (req, res) => {
    const { name, location, startDate, timeBetweenMatch } = req.body;
    const { organizerId } = req.playerId
    try {
        const organizer = Player.findById(organizerId)
        if (organizer.accountType == 'user') {
            return res.status(401).json({ message: 'Player is not allowed to create tournament'})
        }
        const tournament = new Tournament({
            name,
            location,
            organizer: organizerId,
            startDate,
            timeBetweenMatch,
            status: "upcoming",
        })
        await tournament.save();
        res.status(201).json({ message: 'Tournament created successfully', tournament });
    } catch (error) {
        console.error('Error creating tournament:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const addPlayerToTournament = async (req, res) => {
    const { tournamentId } = req.body;
    const { playerId } = req.playerId;
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
    const { tournamentId } = req.body;
    const { playerId } = req.playerId;
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

        let bracket = generateBracket(players);
        const matches = await Promise.all(bracket.map(async (match) => {
            const newMatchId = await createMatch(tournamentId, match.players, tournament.location);
            return newMatchId;
        }))
        bracket.matches = matches;
        tournament.bracket = bracket;
        await tournament.save();
        await startMatch(bracket.matches[0]);
        res.status(200).json({ message: 'Tournament started successfully', tournament });
    } catch (error) {
        console.error('Error starting tournament:', error)
    }
}

export const tournamentNextMatch = async (tournamentId, lastMatchId, currentRound) => {
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            throw new Error('Tournament not found');
        }
        if (tournament.status !== 'ongoing') {
            throw new Error('Tournament not ongoing');
        }
        const bracket = tournament.bracket;
        const currentRoundData = bracket.find(round => round.roundNumber === currentRound);
        const lastMatchIndex = currentRoundData.matches.findIndex(match => match._id.toString() === lastMatchId);
        if (lastMatchIndex === -1) {
            await tournamentNextRound(tournamentId, currentRound);
            return;
        }
        const nextMatchIndex = lastMatchIndex + 1;
        if (nextMatchIndex >= currentRoundData.matches.length) {
            await tournamentNextRound(tournamentId, currentRound);
            return;
        }
        const nextMatchId = currentRoundData.matches[nextMatchIndex];
        const nextMatch = await Match.findById(nextMatchId);
        if (!nextMatch) {
            throw new Error('No next match found');
        }
        if (tournament.timeBetweenMatch === 0) {
            await setMatchDate(nextMatch._id, new Date())
            await startMatch(nextMatch._id)
            return nextMatch;
        }
        await setMatchDate(nextMatch._id, new Date(Date.now() + tournament.timeBetweenMatch * 1000));
        return nextMatch;
        
    } catch (error) {
        console.error('Error getting next match:', error);
        throw new Error('Error getting next match');
    }
}

export const tournamentNextRound = async (tournamentId, currentRound) => {
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            throw new Error('Tournament not found');
        }
        if (tournament.status !== 'ongoing') {
            throw new Error('Tournament not ongoing');
        }
        const bracket = tournament.bracket;
        const currentRoundData = bracket.find(round => round.roundNumber === currentRound);
        if (!currentRoundData) {
            throw new Error('Current round not found');
        }
        if (currentRoundData.matches.length <= 1 && currentRoundData.byes.length === 0) {
            tournament.status = 'completed';
            await tournament.save();
            return;
        }
        const nextRound = await generateNextRound(currentRoundData);
        const nextRoundMatches = await Promise.all(nextRound.matches.map(async (match) => {
            const newMatchId = await createMatch(tournamentId, match.players, tournament.location);
            return newMatchId;
        }))
        nextRound.matches = nextRoundMatches;
        bracket.push(nextRound);
        tournament.bracket = bracket;
        await tournament.save();
        return nextRound;
    } catch (error) {
        console.error('Error getting next round:', error);
        throw new Error('Error getting next round');
    }
}

export const endTournament = async (tournamentId) => {
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            throw new Error('Tournament not found');
        }
        if (tournament.status !== 'ongoing') {
            throw new Error('Tournament not ongoing');
        }
        tournament.status = 'completed';
        await tournament.save();
    } catch (error) {
        console.error('Error ending tournament:', error);
        throw new Error('Error ending tournament');
    }
}

export const getTournament = async (req, res) => {
    const { tournamentId } = req.params;
    try {
        const tournament = await Tournament.findById(tournamentId).populate('playerIds');
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        res.status(200).json({ tournament });
    } catch (error) {
        console.error('Error getting tournament:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}