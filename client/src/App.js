import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

const Home = lazy(() => import("./components/home.component"));
const SignUp = lazy(() => import("./components/signup.component"));
const LogIn = lazy(() => import("./components/login.component"));
const NewNote = lazy(() => import("./components/new-note.component"));
const EditNote = lazy(() => import("./components/edit-note.component"));
const ShowNote = lazy(() => import("./components/show-note.component"));
const ShowUser = lazy(() => import("./components/user-show.component"));

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
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={LogIn} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/notes/new" exact component={NewNote} />
          <Route path="/notes/:noteID" component={ShowNote} />
          <Route path="/notes/:noteID/edit" component={EditNote} />
          <Route path="/users/:userID" exact component={ShowUser} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
