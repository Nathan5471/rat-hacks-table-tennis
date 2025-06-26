import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/drizzle";
import { matches } from "database/schema";
import { jwtVerify } from "jose";

async function verifyRpcToken(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false;
    }

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);

    const { payload } = await jwtVerify(token, secret);

    return payload.type === "rpc";
  } catch (error) {
    console.error("RPC token verification failed:", error);
    return false;
  }
}

export async function POST(request) {
  try {
    const isValidRpc = await verifyRpcToken(request);
    if (!isValidRpc) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, data } = await request.json();
    const db = await getDbAsync();

    switch (action) {
      case "create": {
        const {
          player1Id,
          player2Id,
          player1Score,
          player2Score,
          tournamentId,
        } = data;
        const [match] = await db
          .insert(matches)
          .values({
            player1Id,
            player2Id,
            player1Score,
            player2Score,
            tournamentId,
          })
          .returning();
        return NextResponse.json({ success: true, match });
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Match RPC error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
