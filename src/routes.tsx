import { Route, Switch, useHistory, useLocation } from "react-router";
import React from "react";
import Intro from "./pages/Intro";
import SSHPassword from "./pages/SSHPassword";
import SSHKey from "./pages/SSHKey";
import Error from "./pages/Error";
import Unknown from "./pages/Unknown";
import Detect from "./pages/Detect";
import NotDetected from "./pages/NotDetected";
import BackupPrompt from "./pages/BackupPrompt";
import SSHKeyCreate from "./pages/SSHKeyCreate";
import InstallSSHKey from "./pages/InstallSSHKey";
import Backup from "./pages/Backup";
import Install from "./pages/Install";
import ErrorBoundary from "./components/ErrorBoundary";

export default function AppRoutes() {
  const history = useHistory();
  process.on("uncaughtException", function (error: string) {
    history.replace("/error", { error });
  });
  const location = useLocation();
  console.log(`Loaded: ${location.pathname}`);
  return (
    <ErrorBoundary>
      <Switch>
        <Route exact path="/" component={Intro} />
        <Route exact path="/intro" component={Intro} />
        <Route exact path="/sshpassword" component={SSHPassword} />
        <Route exact path="/sshkey" component={SSHKey} />
        <Route exact path="/error" component={Error} />
        <Route exact path="/detect" component={Detect} />
        <Route exact path="/notdetected" component={NotDetected} />
        <Route exact path="/sshkeycreate" component={SSHKeyCreate} />
        <Route exact path="/installsshkey" component={InstallSSHKey} />
        <Route exact path="/backupprompt" component={BackupPrompt} />
        <Route exact path="/backup" component={Backup} />
        <Route exact path="/install" component={Install} />
        <Route component={Unknown} />
      </Switch>
    </ErrorBoundary>
  );
}
