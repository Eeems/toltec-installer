import { Route, Switch, useHistory } from "react-router";
import React from "react";
import Intro from "./pages/Intro";
import Error from "./pages/Error";
import Unknown from "./pages/Unknown";
import Detect from "./pages/Detect";
import NotDetected from "./pages/NotDetected";
import BackupPrompt from "./pages/BackupPrompt";
import Backup from "./pages/Backup";
import ErrorBoundary from "./components/ErrorBoundary";

export default function AppRoutes() {
  const history = useHistory();
  process.on("uncaughtException", function (error: string) {
    history.replace("/error", { error });
  });
  return (
    <ErrorBoundary>
      <Switch>
        <Route exact path="/" component={Intro} />
        <Route exact path="/intro" component={Intro} />
        <Route exact path="/error" component={Error} />
        <Route exact path="/detect" component={Detect} />
        <Route exact path="/notdetected" component={NotDetected} />
        <Route exact path="/backupprompt" component={BackupPrompt} />
        <Route exact path="/backup" component={Backup} />
        <Route component={Unknown} />
      </Switch>
    </ErrorBoundary>
  );
}
