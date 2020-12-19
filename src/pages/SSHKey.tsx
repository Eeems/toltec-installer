import React, { useState } from "react";
import {
  Text,
  View,
  BoxView,
  Button,
  ProgressBar,
} from "@nodegui/react-nodegui";
import { Direction, FileMode } from "@nodegui/nodegui";
import { useHistory, useLocation } from "react-router";
import FilePicker from "../components/FilePicker";
import { existsSync } from "fs";
import { homedir } from "os";
import { connect } from "../ssh";

export default function SSHKey() {
  const sshKeyRef = React.useRef(homedir() + "/.ssh/id_rsa");
  const [error, setError] = React.useState("");
  const location = useLocation();
  const history = useHistory();
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
        setError("Failed to connect!");
        sshKeyRef.current = "";
        break;
      default:
        console.log("Unknown error");
        history.replace(`/error`, { error });
        break;
    }
  };
  const connectToDevice = () => {
    setError("");
    console.log("Connecting to device...");
    try {
      connect(undefined, sshKeyRef.current)
        .then(function () {
          history.replace("/detect", { password: false });
        })
        .catch(catchError);
    } catch (error) {
      catchError(error);
    }
  };
  const sshKeyExists = existsSync(sshKeyRef.current);
  return (
    <BoxView direction={Direction.TopToBottom}>
      <FilePicker
        selectedFiles={sshKeyRef.current}
        fileMode={FileMode.ExistingFile}
        onChange={(value) => {
          sshKeyRef.current = value;
        }}
        onReturnPressed={connectToDevice}
      />
      <Text visible={!sshKeyExists} style="color: red;">
        File does not exist!
      </Text>
      <Text style="color: red;">{error}</Text>
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <View />
        <View />
        <View />
        <Button
          on={{ clicked: connectToDevice }}
          enabled={sshKeyExists}
          text="Use Key"
        />
      </BoxView>
    </BoxView>
  );
}
