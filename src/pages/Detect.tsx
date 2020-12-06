import React from "react";
import { Text, View, Button } from "@nodegui/react-nodegui";
import { useHistory } from "react-router";
import { exec, disconnect } from "../ssh";

export default function Detect() {
  const history = useHistory();
  React.useEffect(() => {
    console.log("Checking device...");
    exec("cat /sys/devices/soc0/machine")
      .then((result) => {
        const machine = result.stdout.join(" ").trim();
        if (!machine.startsWith("reMarkable")) {
          history.push(
            `/error/${JSON.stringify(
              "The connected device is not a reMarkable"
            )}`
          );
          return;
        }
        if (machine == "reMarkable 2.0") {
          history.push(`/device/rm2`);
        } else {
          history.push(`/device/rm1`);
        }
      })
      .catch(function (e) {
        history.push(`/error/${JSON.stringify(e + "")}`);
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
      <Text>Toltec installer</Text>
      <Text>Checking device...</Text>
    </View>
  );
}
