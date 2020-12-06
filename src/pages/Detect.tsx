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
        if (machine == "reMarkable 2.0") {
          history.replace(`/backup`, { device: "rm2" });
        } else {
          history.replace(`/backup`, { device: "rm1" });
        }
      })
      .catch(function (error) {
        history.replace(`/error`, Object.assign(location.state, { error }));
      });
  }, []);
  return (
    <View
      style={`
        height: '100%';
        align-items: 'center';
        justify-content: 'center';
      `}
    >
      <Text>Checking device...</Text>
    </View>
  );
}
