import Match from "../models/match";
import Player from "../models/player";

export const createMatch = async (tournamentId, players, location) => {
    try {
        const player1 = await Player.findById(players[0]);
        const player2 = await Player.findById(players[1]);
        if (!player1 || !player2) {
            throw new Error("Player not found");
        }
        const match = new Match({
            tournamentId,
            player1Id: players[0],
            player2Id: players[1],
            location
        })
        await match.save();
        return match._id;
    } catch (error) {
        console.error("Error creating match:", error);
        throw new Error("Error creating match");
    }
}

export const editMatchDate = async (matchId, newDate) => {
    try {
        const match = await Match.findById(matchId);
        if (!match) {
            throw new Error("Match not found");
        }
        match.date = newDate;
        await match.save();
        return match;
    } catch (error) {
        console.error("Error editing match date:", error);
        throw new Error("Error editing match date");
    }
}

export const startMatch = async (matchId) => {
    try {
        const match = await Match.findById(matchId);
        if (!match) {
            throw new Error("Match not found");
        }
        match.status = "in-progress";
        await match.save();
        return match;
    } catch (error) {
        console.error("Error starting match:", error);
        throw new Error("Error starting match");
    }
}

export const endMatch = async (matchId, winnerId, scores) => {
    try {
        const match = await Match.findById(matchId);
        if (!match) {
            throw new Error("Match not found");
        }
        match.status = "completed";
        match.winnerId = winnerId;
        match.scores = scores;
        await match.save();
        return match;
    } catch (error) {
        console.error("Error ending match:", error);
        throw new Error("Error ending match");
    }
}

export const getMatchDetails = async (matchId) => {
    try {
        const match = await Match.findById(matchId).populate('player1Id player2Id');
        if (!match) {
            throw new Error("Match not found");
        }
        return match;
    } catch (error) {
        console.error("Error getting match details:", error);
        throw new Error("Error getting match details");
    }
}