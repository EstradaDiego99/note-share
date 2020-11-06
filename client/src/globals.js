const backendURL =
  process.env.NODE_ENV === "production"
    ? "https://note-share-web.herokuapp.com/api"
    : "http://localhost:5000/api";

module.exports = { backendURL };
