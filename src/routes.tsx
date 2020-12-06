import { Route, Switch } from "react-router";
import React from "react";
import Intro from "./pages/Intro";
import Error from "./pages/Error";
import Unknown from "./pages/Unknown";
import Detect from "./pages/Detect";

export default function AppRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={Intro} />
      <Route exact path="/intro" component={Intro} />
      <Route exact path="/detect" component={Detect} />
      <Route exact path="/error/:error" component={Error} />
      <Route component={Unknown} />
    </Switch>
  );
}
