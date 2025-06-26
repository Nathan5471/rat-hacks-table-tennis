/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { DurableObject, WorkerEntrypoint } from "cloudflare:workers";
import { jwtVerify, SignJWT } from "jose";

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		let path = url.pathname.split("/");
		path.splice(0, 1);

		switch (path[0]) {
			case "ws":
				const id = env.TOURNAMENT.idFromName(path[1]);
				const stub = env.TOURNAMENT.get(id);
				return stub.fetch(request);
			default:
				return new Response("Not Found", { status: 404 });
		}
	},
};

async function verifyToken(token, env) {
	try {
		const secret = new TextEncoder().encode(env.TOKEN_SECRET);

		const { payload } = await jwtVerify(token, secret);

		const currentTime = Math.floor(Date.now() / 1000);

		if (payload.exp && payload.exp < currentTime) {
			console.log("Token has expired.");
			return;
		}

		return { username: payload.username, admin: payload.admin };
	} catch (error) {
		console.error("JWT verification failed:", error);
		return false;
	}
}

export class Tournament extends DurableObject {
	constructor(state, env) {
		super(state, env);
		this.env = env;
		this.state = state;
		this.storage = state.storage;
		this.state.blockConcurrencyWhile(async () => {
			this.size = (await this.storage.get("size")) || null;
			this.tournamentId = (await this.storage.get("tournamentId")) || null;
			this.users = (await this.storage.get("users")) || null;
			this.bracket = (await this.storage.get("bracket")) || null;
			this.currentMatchNumber =
				(await this.storage.get("currentMatchNumber")) || 1;
			this.currentRoundIndex =
				(await this.storage.get("currentRoundIndex")) || 0; // 0 indexed
			this.currentPlayer1 = (await this.storage.get("currentPlayer1")) || null;
			this.currentPlayer2 = (await this.storage.get("currentPlayer2")) || null;
			this.currentScores = (await this.storage.get("currentScores")) || [0, 0];
		});
		this.sessions = new Map();
		this.state.getWebSockets().forEach((webSocket) => {
			let meta = webSocket.deserializeAttachment();
			this.sessions.set(webSocket, { ...meta });
		});
	}
	/*
		I know the naming conventions are kinda weird but basically
		blank*Number* is a variable that is one indexed and used for keeping
		track of something that doesn't directly correspond to a place on the bracket.
		blank*index* is a variable that is zero indexed and directly correlates to
		part of the bracket.

		For example, every match in the bracket has a "number" based on when it should be played.
		If we have a bracket that has four matches in the first round, two in the second round,
		and one in the third round, then the first match in the second round has a match "number"
		of five because it is played immediatly after the four matches in the first round.

		We have a function that converts a match number into two indices: the round index, and the match
		index. So in the scenerio where we have four match in the first round, given an input match
		number of five, the function will return one for the round index and 0 for the match index
		(second round, first match).

		- Bear Tyree, one of few comments
	*/

	async fetch() {
		let pair = new WebSocketPair();

		await this.handleSession(pair[1]);

		return new Response(null, {
			status: 101,
			webSocket: pair[0],
			headers: {
				Upgrade: "websocket",
				Connection: "Upgrade",
			},
		});
	}

	async startTournament(size, users, tournamentId) {
		this.size = size;
		this.tournamentId = tournamentId;
		this.users = users;
		let initialBracket = [[]];
		let chunk = [];
		for (let i = 0; i < size; i++) {
			chunk.push(users[i]);
			if (chunk.length > 1) {
				initialBracket[0].push([...chunk]);
				chunk = [];
			}
		}
		this.bracket = initialBracket;
		this.currentMatchNumber = 1;
		this.currentRoundIndex = 0;
		const { roundIndex, matchIndex } = this.returnRoundAndMatch(size, 1);
		this.currentPlayer1 = this.bracket[roundIndex][matchIndex][0];
		this.currentPlayer2 = this.bracket[roundIndex][matchIndex][1];
		this.currentScores = [0, 0];
		await this.saveState();
	}

	async saveState() {
		await this.storage.put("size", this.size);
		await this.storage.put("tournamentId", this.tournamentId);
		await this.storage.put("users", this.users);
		await this.storage.put("bracket", this.bracket);
		await this.storage.put("currentMatchNumber", this.currentMatchNumber);
		await this.storage.put("currentRoundIndex", this.currentRoundIndex);
		await this.storage.put("currentPlayer1", this.currentPlayer1);
		await this.storage.put("currentPlayer2", this.currentPlayer2);
		await this.storage.put("currentScores", this.currentScores);
	}

	async handleSession(ws) {
		this.state.acceptWebSocket(ws);
		this.sessions.set(ws);
		ws.send(
			JSON.stringify({
				event: "tournamentState",
				data: {
					size: this.size,
					roundIndex: this.currentRoundIndex,
					matchIndex: this.returnRoundAndMatch(
						this.size,
						this.currentMatchNumber
					).matchIndex,
					player1: this.currentPlayer1,
					player2: this.currentPlayer2,
					scores: this.currentScores,
				},
			})
		);
	}

	async webSocketClose(ws) {
		this.sessions.delete(ws);
	}

	async webSocketError(ws, error) {
		this.sessions.delete(ws);
		console.log(error);
	}

	async webSocketMessage(ws, message, env) {
		const { event, data } = JSON.parse(message);

		switch (event) {
			case "admin": {
				const { token } = data;
				const { username, admin } = await verifyToken(token, this.env);

				if (!username || !admin) {
					return;
				}

				let session = this.sessions.get(ws) || {};
				session.username = username;
				session.admin = admin;
				this.sessions.set(ws, session);

				ws.serializeAttachment({ username, admin });

				break;
			}
			case "addPlayer1Point": {
				const session = this.sessions.get(ws);
				const admin = session?.admin;

				if (admin) {
					this.currentScores[0] += 1;
					await this.saveState();
					this.broadcastMessage("scores", { scores: this.currentScores });
					await this.checkScores();
				}
				break;
			}
			case "addPlayer2Point": {
				const session = this.sessions.get(ws);
				const admin = session?.admin;

				if (admin) {
					this.currentScores[1] += 1;
					await this.saveState();
					this.broadcastMessage("scores", { scores: this.currentScores });
					await this.checkScores();
				}
				break;
			}
			case "subtractPlayer1Point": {
				const session = this.sessions.get(ws);
				const admin = session?.admin;

				if (admin) {
					this.currentScores[0] += -1;
					await this.saveState();
					this.broadcastMessage("scores", { scores: this.currentScores });
					await this.checkScores();
				}
				break;
			}
			case "subtractPlayer2Point": {
				const session = this.sessions.get(ws);
				const admin = session?.admin;

				if (admin) {
					this.currentScores[1] += -1;
					await this.saveState();
					this.broadcastMessage("scores", { scores: this.currentScores });
					await this.checkScores();
				}
				break;
			}
		}
	}

	async checkScores() {
		if (this.currentScores[0] > 10 || this.currentScores[1] > 10) {
			await this.matchEnd();
		}
	}

	async matchEnd() {


		if () {return}
			let { roundIndex, matchIndex } = this.returnRoundAndMatch(
				this.size,
				this.currentMatchNumber
			);

			let createdMatch = createMatchRequest.match;

			createdMatch.player1 = this.currentPlayer1;
			createdMatch.player2 = this.currentPlayer2;

			this.bracket[roundIndex][matchIndex] = createdMatch;

			const nextRoundIndex = this.returnRoundAndMatch(
				this.size,
				this.currentMatchNumber + 1
			).roundIndex;

			if (nextRoundIndex > this.currentRoundIndex) {
				let lastRoundWinners = [];

				for (let match of this.bracket[roundIndex]) {
					if (match.player1Score > match.player2Score) {
						lastRoundWinners.push(match.player1);
						break;
					}
					lastRoundWinners.push(match.player2);
				}

				if (lastRoundWinners.length == 1) {
					this.bracket.push([]);
				}
			}

			this.saveState();

	}

	async broadcastMessage(event, data) {
		this.sessions.forEach((_, ws) => {
			try {
				ws.send(JSON.stringify({ event, data }));
			} catch (error) {
				this.sessions.delete(ws);
			}
		});
	}

	returnRoundAndMatch(numPlayers, matchNumber) {
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
}

export class TournamentEntry extends WorkerEntrypoint {
	async startTournament(id, size, users) {
		const stubId = this.env.TOURNAMENT.idFromName(id.toString());
		const stub = this.env.TOURNAMENT.get(stubId);
		await stub.startTournament(size, users, id);
	}
}
