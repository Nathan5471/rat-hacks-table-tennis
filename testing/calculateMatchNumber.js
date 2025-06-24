function returnRoundAndMatch(numPlayers, matchNumber) {
  const loopThrough = (numPlayersRemainder, matchNumberRemainder, depth) => {
    let matches = numPlayersRemainder / 2;

    if (matchNumberRemainder > matches) {
      return loopThrough(matches, matchNumberRemainder - matches, depth + 1);
    }

    return [depth, matchNumberRemainder - 1];
  };

  let matches = numPlayers / 2;

  if (matchNumber > matches) {
    return loopThrough(matches, matchNumber - matches, 1);
  }

  return [0, matchNumber - 1];
}

console.log(returnRoundAndMatch(32, 30));
