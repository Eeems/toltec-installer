import React from "react";
import { Text, BoxView, View, LineEdit, Button } from "@nodegui/react-nodegui";
import { EchoMode, Direction } from "@nodegui/nodegui";
import { useHistory, useLocation } from "react-router";
import { connect } from "../ssh";

export default function sshpassword() {
  const history = useHistory();
  const location = useLocation();
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const passwordRef = React.useRef(password);
  const catchError = (password: string, error?: string) => {
    error = ("" + error).trim();
    console.log(`Error detected: ${error}`);
    switch (error) {
      case "Error: connect EHOSTUNREACH 10.11.99.1:22":
        connectToDevice(password);
        break;
      case "Error: Timed out while waiting for handshake":
        console.log("Device not detected");
        history.replace(`/notdetected`, { error });
        break;
      case "Error: All configured authentication methods failed":
        console.log("Unable to connect");
        setError("Incorrect password");
        setPassword("");
        break;
      default:
        console.log("Unknown error");
        history.replace(`/error`, { error });
        break;
    }
  };
  const connectToDevice = (password: string) => {
    console.log("Connecting to device...");
    try {
      connect(password)
        .then(function () {
          history.replace("/detect");
        })
        .catch((error) => {
          catchError(password, error);
        });
    } catch (error) {
      catchError(password, error);
    }
  };
  const onTextChanged = (value) => {
    setPassword(value);
  };
  return (
    <BoxView direction={Direction.TopToBottom}>
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <Text>SSH Password</Text>
        <LineEdit
          text={password}
          on={{ textChanged: onTextChanged }}
          echoMode={EchoMode.Password}
        />
      </BoxView>
      <Text style="color: red;">{error}</Text>
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <View />
        <View />
        <View />
        <Button
          enabled={!!password}
          on={{ clicked: () => connectToDevice(password) }}
          text="Connect"
        />
      </BoxView>
    </BoxView>
  );
}
