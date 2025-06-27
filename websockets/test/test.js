const bracket = [
	[
		{ loser: "a", winner: "b" },
		{ loser: "c", winner: "d" },
	],
	[{ loser: "b", winner: "d" }],
];

const users = ["a", "b", "c", "d", "e", "f", "g"];
const size = 4;

const standings = [];

for (let i = 0; i < size - 1; i++) {
	const { roundIndex, matchIndex } = returnRoundAndMatch(size, size - 1 - i);
	if (i == 0) {
		standings.push([bracket[roundIndex][matchIndex].winner, i + 1]);
	}
	standings.push([bracket[roundIndex][matchIndex].loser, i + 2]);
}

console.log(standings);

function returnRoundAndMatch(numPlayers, matchNumber) {
	const loopThrough = (numPlayersRemainder, matchNumberRemainder, depth) => {
		let matches = numPlayersRemainder / 2;

		if (matchNumberRemainder > matches) {
			return loopThrough(matches, matchNumberRemainder - matches, depth + 1);
		}

		return { roundIndex: depth, matchIndex: matchNumberRemainder - 1 };
	};

	let matches = numPlayers / 2;

	if (matchNumber > matches) {
		return loopThrough(matches, matchNumber - matches, 1);
	}

	return { roundIndex: 0, matchIndex: matchNumber - 1 };
}
