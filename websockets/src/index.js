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

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		switch (url.pathname) {
			case "/message":
				return new Response("Hello, World!");
			case "/random":
				return new Response(crypto.randomUUID());
			default:
				return new Response("Not Found", { status: 404 });
		}
	},
};

export class Tournament extends DurableObject {
	constructor(state, env) {
		super(state, env);
		this.env = env;
		this.state = state;
		this.storage = state.storage;
		this.state.blockConcurrencyWhile(async () => {
			this.size = (await this.storage.get("size")) || null;
			this.bracket = (await this.storage.get("bracket")) || null;
			this.currentMatchNumber =
				(await this.storage.get("currentMatchNumber")) || 1;
			this.currentRoundNumber =
				(await this.storage.get("currentRoundNumber")) || 0; // 0 indexed
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

	async startTournament(size, users) {
		this.size = size;
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
		this.currentRoundNumber = 0;
		const { roundNumber, matchNumber } = this.returnRoundAndMatch(size, 1);
		this.currentPlayer1 = this.bracket[roundNumber][matchNumber][0];
		this.currentPlayer2 = this.bracket[roundNumber][matchNumber][1];
		this.currentScores = [0, 0];
		await this.saveState();
	}

	async saveState() {
		await this.storage.put("size", this.size);
		await this.storage.put("bracket", this.bracket);
		await this.storage.put("currentMatchNumber", this.currentMatchNumber);
		await this.storage.put("currentRoundNumber", this.currentRoundNumber);
		await this.storage.put("currentPlayer1", this.currentPlayer1);
		await this.storage.put("currentPlayer2", this.currentPlayer2);
		await this.storage.put("currentScores", this.currentScores);
	}

	returnRoundAndMatch(numPlayers, matchNumber) {
		const loopThrough = (numPlayersRemainder, matchNumberRemainder, depth) => {
			let matches = numPlayersRemainder / 2;

			if (matchNumberRemainder > matches) {
				return loopThrough(matches, matchNumberRemainder - matches, depth + 1);
			}

			return { roundNumber: depth, matchNumber: matchNumberRemainder - 1 };
		};

		let matches = numPlayers / 2;

		if (matchNumber > matches) {
			return loopThrough(matches, matchNumber - matches, 1);
		}

		return { roundNumber: 0, matchNumber: matchNumber - 1 };
	}
}

export class TournamentEntry extends WorkerEntrypoint {
	async startTournament(id, size, users) {
		const stubId = this.env.TOURNAMENT.idFromName(id.toString());
		const stub = this.env.TOURNAMENT.get(stubId);
		await stub.startTournament(size, users);
	}
}
