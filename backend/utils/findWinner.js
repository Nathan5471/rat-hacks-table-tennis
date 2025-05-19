export const findWinner = (player1Score, player2Score) => {
    if (player1Score >= 11 && player1Score - player2Score >= 2) {
        return 1; // Player 1 wins
    } else if (player2Score >= 11 && player2Score - player1Score >= 2) {
        return 2; // Player 2 wins
    }
    return 0; // No winner yet
}