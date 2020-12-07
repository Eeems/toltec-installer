import React from "react";
import { Text, View, Button } from "@nodegui/react-nodegui";
import { useHistory, useLocation } from "react-router";
import { exec } from "../ssh";

export default function Detect() {
  const history = useHistory();
  const location = useLocation();
  React.useEffect(() => {
    console.log("Checking device...");
    exec("cat /sys/devices/soc0/machine")
      .then((result) => {
        const machine = result.stdout.join(" ").trim();
        if (!machine.startsWith("reMarkable")) {
          history.replace(
            "/error",
            Object.assign(location.state, {
              error: "The connected device is not a reMarkable",
            })
          );
          return;
        }
        history.replace(`/backupprompt`, {
          device: machine == "reMarkable 2.0" ? "rm2" : "rm1",
        });
      })
      .catch(function (error) {
        history.replace(
          `/error`,
          Object.assign(location.state || {}, { error })
        );
      });
  }, []);
  return (
    <View>
      <Text>Checking device...</Text>
    </View>
  );
}
