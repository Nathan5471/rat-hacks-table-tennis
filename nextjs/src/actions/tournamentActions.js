"use server";

import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/drizzle";
import { tournaments } from "@/lib/schema";
import { redirect } from "next/navigation";

export async function createTournament(size, name) {
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
