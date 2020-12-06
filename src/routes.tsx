import { Route, Switch } from "react-router";
import React from "react";
import Intro from "./pages/Intro";
import Error from "./pages/Error";
import Unknown from "./pages/Unknown";
import Detect from "./pages/Detect";
import NotDetected from "./pages/NotDetected";
import Backup from "./pages/Backup";

export default function AppRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={Intro} />
      <Route exact path="/intro" component={Intro} />
      <Route exact path="/error" component={Error} />
      <Route exact path="/detect" component={Detect} />
      <Route exact path="/notdetected" component={NotDetected} />
      <Route exact path="/backup" component={Backup} />
      <Route component={Unknown} />
    </Switch>
  );
}
