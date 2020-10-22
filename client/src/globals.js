const backendURL =
  process.env.NODE_ENV === "production"
    ? "https://note-share-web.herokuapp.com"
    : "http://localhost:5000";

module.exports = { backendURL };
