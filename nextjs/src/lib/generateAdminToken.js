import { SignJWT } from "jose";

export default async function generateAdminToken(username) {
  const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
  const alg = "HS256";

  const jwt = await new SignJWT({ username, admin: true })
    .setProtectedHeader({ alg })
    .setExpirationTime("2h")
    .sign(secret);

  return jwt;
}
