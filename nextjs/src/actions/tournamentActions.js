"use server";

import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/drizzle";
import { tournaments, tournamentUsers, users } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTournament(name, size) {
  const db = await getDbAsync();

  const { username, admin } = await authenticated();

  if (!username || !admin) {
    return;
  }

  try {
    await db.insert(tournaments).values({
      size: size,
      status: "upcoming",
      name,
    });
  } catch (err) {
    console.log(err);
  }

  redirect("/adminpanel");
}

export async function editTournament(id, name, size) {
  const db = await getDbAsync();

  const { username, admin } = await authenticated();

  if (!username || !admin) {
    return;
  }

  try {
    const update = await db
      .update(tournaments)
      .set({ name, size })
      .where(eq(tournaments.id, id))
      .returning();

    if (!update || update.length === 0) {
      return;
    }
  } catch (err) {
    console.log(err);
    return;
  }

  redirect("/adminpanel");
}

export async function joinTournament(id) {
  const db = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    throw new Error("Not authenticated");
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    const tournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, id),
      with: { users: { with: { user: true } } },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    if (tournament.status !== "upcoming") {
      throw new Error("Cannot join tournament that is not upcoming");
    }

    const count = tournament.users.length;

    if (count >= tournament.size) {
      throw new Error("Tournament is full");
    }

    const alreadyJoined = tournament.users.some((tu) => tu.user.id === user.id);
    if (alreadyJoined) {
      throw new Error("Already joined this tournament");
    }

    await db.insert(tournamentUsers).values({
      userId: user.id,
      tournamentId: parseInt(id),
    });

    revalidatePath("/tournaments");
  } catch (err) {
    console.log(err);
  }
}

export async function leaveTournament(id) {
  const db = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    throw new Error("Not authenticated");
  }
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    const tournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, id),
      with: { users: { with: { user: true } } },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    if (tournament.status !== "upcoming") {
      throw new Error("Cannot leave tournament that is not upcoming");
    }

    let deleted = await db
      .delete(tournamentUsers)
      .where(
        and(
          eq(tournamentUsers.userId, user.id),
          eq(tournamentUsers.tournamentId, tournament.id)
        )
      )
      .returning();

    if (!deleted) {
      throw new Error("Error deleting row");
    }
  } catch (err) {
    console.log(err);
  }

  revalidatePath("/tournaments");
}
