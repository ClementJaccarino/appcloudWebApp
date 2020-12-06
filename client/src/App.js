import AppNavbar from "./components/AppNavbar";
import UserPage from "./components/UserPage";
import AnalystePage from "./components/AnalystePage";
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
            <UserPage></UserPage>
          </Route>
          <Route path="/admin"></Route>
          <Route path="/analyste">
            <AnalystePage></AnalystePage>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
