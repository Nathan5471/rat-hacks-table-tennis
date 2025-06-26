/* eslint-disable import/no-anonymous-default-export */
import { drizzle } from "drizzle-orm/d1";
import { admins } from "../../database/schema.js/index.js";
import hash from "@/lib/hash.js";

export default {
  async fetch(req, env) {
    const { username, password } = await req.json();
    const result = await createAdmin(username, password, env);
    return new Response(result, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  },
};

async function createAdmin(username, password, env) {
  if (!username || !password) {
    console.error("Usage: npm run create-admin <username> <password>");
  }

  try {
    const db = drizzle(env.DB);
    const arrayBuffer = new Uint8Array(16);
    crypto.getRandomValues(arrayBuffer);
    let salt = Array.from(arrayBuffer, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");

    const passwordHash = await hash(password + salt);

    await db.insert(admins).values({
      username,
      passwordHash: passwordHash,
      passwordSalt: salt,
    });

    console.log(`✅ Admin user '${username}' created successfully!`);
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      console.error(`❌ Admin with username '${username}' already exists!`);
    } else {
      console.error("❌ Error creating admin:", error.message);
    }
  }
}
