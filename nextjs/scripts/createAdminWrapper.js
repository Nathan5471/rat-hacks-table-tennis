import { spawn } from "child_process";

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error("Usage: npm run create-admin <username> <password>");
  process.exit(1);
}

console.log("Starting Wrangler dev server...");

const wrangler = spawn("cmd", [
  "/c",
  "wrangler",
  "dev",
  "--test-scheduled",
  "scripts/createAdmin.js",
]); // wrangler dev --test-scheduled scripts/createAdmin.js

wrangler.stdout.on("data", (data) => {
  console.log(`${data}`);
});

wrangler.stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);
});

wrangler.on("error", (error) => {
  console.log(`error: ${error.message}`);
});

wrangler.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});

setTimeout(() => {
  const request = spawn("cmd", [
    "/c",
    "node",
    "scripts/createAdminRequest.js",
    username,
    password,
  ]);

  request.stdout.on("data", (data) => {
    console.log(`${data}`);
  });

  request.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  request.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  request.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    process.exit(1);
  });
}, 3000);
