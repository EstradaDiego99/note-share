require("dotenv").config();
const fs = require("fs");

console.log("Writting Google Cloud Platform key file");
fs.writeFileSync(
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  process.env.GCP_CRED
);
