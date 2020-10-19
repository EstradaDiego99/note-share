import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SignUp from "./components/signup.component";
import LogIn from "./components/login.component";
import Home from "./components/home.component";
import NewNote from "./components/new-note.component";
import "./App.css";

function App() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  // We listen to the resize event
  window.addEventListener("resize", () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });

  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={LogIn} />
      <Route path="/signup" exact component={SignUp} />
      <Route path="/new_note" exact component={NewNote} />
    </Router>
  );
}

export default App;
