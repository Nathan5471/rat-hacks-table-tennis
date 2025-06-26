"use server";

import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/drizzle";
import { tournaments, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
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
    return { error: "Not authenticated" };
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    const count = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, id),
      with: { users: { with: { user: true } } },
    });

    console.log(count);
  } catch (err) {
    console.log(err);
  }
}

export async function leaveTournament(id) {
  const db = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    return { error: "Not authenticated" };
  }
}
