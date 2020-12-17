import React from "react";
import { Text, BoxView, View } from "@nodegui/react-nodegui";
import { useHistory, useLocation } from "react-router";
import { connect } from "../ssh";

export default function Intro() {
  const history = useHistory();
  const location = useLocation();
  const catchError = (error?: string) => {
    error = ("" + error).trim();
    console.log(`Error detected: ${error}`);
    switch (error) {
      case "Error: connect EHOSTUNREACH 10.11.99.1:22":
        connectToDevice();
        break;
      case "Error: Timed out while waiting for handshake":
        console.log("Device not detected");
        history.replace(`/notdetected`, { error });
        break;
      case "Error: All configured authentication methods failed":
        console.log("Unable to connect");
        history.replace(`/sshpassword`);
        break;
      default:
        console.log("Unknown error");
        history.replace(`/error`, { error });
        break;
    }
  };
  const connectToDevice = () => {
    console.log("Connecting to device...");
    try {
      connect()
        .then(function () {
          history.replace("/detect");
        })
        .catch(catchError);
    } catch (error) {
      catchError(error);
    }
  };
  React.useEffect(connectToDevice, []);
  return (
    <BoxView>
      <View>
        <Text>Looking for reMarkable...</Text>
      </View>
    </BoxView>
  );
}
