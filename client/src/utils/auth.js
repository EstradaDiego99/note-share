import axios from "axios";
import Cookies from "js-cookie";
import { backendURL } from "../utils/globals";

const authenticateUser = async () => {
  const authResponse = await axios.post(`${backendURL}/authenticate/`, {
    token: Cookies.get("note_share_id_token"),
  });
  const loggedID = authResponse.data.jwtVerification._id;
  const loggedUser = await axios.get(`${backendURL}/users/${loggedID}`);
  if (!loggedUser.data) throw new Error({ status: 410 });
  return loggedUser.data;
};

const logout = () => {
  Cookies.remove("note_share_id_token");
  window.location = "/login";
};

export { authenticateUser, logout };
