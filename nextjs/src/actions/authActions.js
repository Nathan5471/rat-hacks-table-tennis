"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDbAsync } from "@/lib/drizzle.js";
import hash from "@/lib/hash.js";
import generateToken from "@/lib/generateToken";
import generateAdminToken from "@/lib/generateAdminToken";
import { authenticated } from "@/controllers/auth.js";
import { users, admins } from "database/schema";

export async function authenticate(formData) {
  const cookieStore = await cookies();

  const db = await getDbAsync();

  const username = formData.get("username");
  const password = formData.get("password");

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  if (!user) {
    return;
  }

  const salt = user.passwordSalt;

  const passwordHash = await hash(password + salt);

  if (passwordHash !== user.passwordHash) {
    return;
  }

  cookieStore.set({
    name: "token",
    value: await generateToken(username),
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 2, // 2 days
    path: "/",
  });

  redirect("/home");
}

export async function adminAuthenticate(formData) {
  const cookieStore = await cookies();

  const db = await getDbAsync();

  const username = formData.get("username");
  const password = formData.get("password");

  const admin = await db.query.admins.findFirst({
    where: (admins, { eq }) => eq(admins.username, username),
  });

  if (!admin) {
    return;
  }

  const salt = admin.passwordSalt;

  const passwordHash = await hash(password + salt);

  if (passwordHash !== admin.passwordHash) {
    return;
  }

  cookieStore.set({
    name: "token",
    value: await generateAdminToken(username),
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 2, // 2 days
    path: "/",
  });

  redirect("/adminpanel");
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("token");

  redirect("/login");
}

export async function createUser(formData) {
  const cookieStore = await cookies();

  const db = await getDbAsync();

  const username = formData.get("username");
  const password = formData.get("password");

  const arrayBuffer = new Uint8Array(16);
  crypto.getRandomValues(arrayBuffer);
  let salt = Array.from(arrayBuffer, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  const passwordHash = await hash(password + salt);

  try {
    await db.insert(users).values({
      username,
      passwordHash,
      passwordSalt: salt,
    });

    cookieStore.set({
      name: "token",
      value: await generateToken(username),
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 2, // 2 days
      path: "/",
    });
  } catch (error) {
    console.log(error);
    return;
  }
  redirect("/home");
}

export async function checkToken() {
  const cookieStore = await cookies();

  const username = await authenticated();

  if (!username) {
    cookieStore.delete("token");
    return;
  }

  cookieStore.set("token", await generateToken(username));
}
