import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "../database/schema.js",
  out: "../database/drizzle",
});
