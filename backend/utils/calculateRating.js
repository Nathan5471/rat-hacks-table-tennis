import Match from "../models/match.js";
import Player from "../models/player.js";

export const calculateRating = async (matchId) => {
    const match = await Match.findById(matchId);
    const player1 = await Player.findById(match.player1Id);
    const player2 = await Player.findById(match.player2Id);
    if (!match || !player1 || !player2) {
        throw new Error("Match or players not found");
    }
    const winnerId = match.winnerId;
    let player1Outcome = 0;
    let player2Outcome = 0;
    if (winnerId === player1._id) {
        player1Outcome = 1;
        player2Outcome = 0;
    } else if (winnerId === player2._id) {
        player1Outcome = 0;
        player2Outcome = 1;
    }
    const player1NewRating = player1.rating + 32 * (player1Outcome - 1 / (1 + Math.pow(10, (player2.rating - player1.rating) / 400)));
    const player2NewRating = player2.rating + 32 * (player2Outcome - 1 / (1 + Math.pow(10, (player1.rating - player2.rating) / 400)));
    player1.rating = Math.round(player1NewRating);
    player2.rating = Math.round(player2NewRating);
    await player1.save();
    await player2.save();
}