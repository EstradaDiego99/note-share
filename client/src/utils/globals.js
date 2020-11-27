/** URL used to connect to the back-end of the application, picking between the
 * appropiate both for development and for production
 */
const backendURL =
  process.env.NODE_ENV === "production"
    ? "https://note-share-web.herokuapp.com/api"
    : "http://localhost:5000/api";

/** Is the second string a substring of the first one?
 * @param {String} outer
 * @param {String} inner
 * @returns {boolean}
 */
const stringsMatch = (outer, inner) => {
  outer = outer
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  inner = inner
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return outer.indexOf(inner) !== -1;
};

export { backendURL, stringsMatch };
