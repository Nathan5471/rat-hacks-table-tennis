import Player from "../models/player.js";

export const calculateRating = async (matchId) => {
    const match = await Match.findById(matchId);
    const player1 = await Player.findById(match.player1Id);
    const player2 = await Player.findById(match.player2Id);
    if (!match || !player1 || !player2) {
        throw new Error("Match or players not found");
    }
    // Calculate the new rating for player1
    const player1NewRating = player1.rating + 32 * (1 - 1 / (1 + Math.pow(10, (player2.rating - player1.rating) / 400)));
    player1.rating = player1NewRating;
    await player1.save();
    // Calculate the new rating for player2
    const player2NewRating = player2.rating + 32 * (0 - 1 / (1 + Math.pow(10, (player1.rating - player2.rating) / 400)));
    player2.rating = player2NewRating;
    await player2.save();
}