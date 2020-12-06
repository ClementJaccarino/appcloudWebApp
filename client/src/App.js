import AppNavbar from "./components/AppNavbar";
import PodcastList from "./components/PodcastList";
import ReviewsList from "./components/ReviewsList";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <AppNavbar></AppNavbar>
        <Switch>
          <Route path="/" exact>
            <PodcastList></PodcastList>
          </Route>
          <Route path="/admin">
            <ReviewsList></ReviewsList>
          </Route>
          <Route path="/analyste">
            <h1>anlayste</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
