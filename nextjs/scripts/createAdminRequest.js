async function createAdminRequest() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.error("Usage: npm run request-admin <username> <password>");
    process.exit(1);
  }

  try {
    // This will make a request to the Wrangler dev server running your worker
    const response = await fetch("http://localhost:8787", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error making request:", error.message);
  }
}

createAdminRequest();
