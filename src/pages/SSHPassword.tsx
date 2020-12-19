import React from "react";
import { Text, BoxView, View, LineEdit, Button } from "@nodegui/react-nodegui";
import { EchoMode, Direction, FocusReason } from "@nodegui/nodegui";
import { useHistory, useLocation } from "react-router";
import { connect } from "../ssh";

export default function sshpassword({ ref = React.useRef(null) as any }) {
  const history = useHistory();
  const location = useLocation();
  const [error, setError] = React.useState("");
  const passwordRef = React.useRef("");
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
        setError("Incorrect password");
        passwordRef.current = "";
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
      connect(passwordRef.current)
        .then(function () {
          history.replace("/detect", { password: true });
        })
        .catch(catchError);
    } catch (error) {
      catchError(error);
    }
  };
  React.useEffect(() => {
    ref.current.setFocus(FocusReason.OtherFocusReason);
  }, []);
  return (
    <BoxView direction={Direction.TopToBottom}>
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <Text>SSH Password</Text>
        <LineEdit
          text={passwordRef.current}
          on={{
            textChanged: (value) => {
              passwordRef.current = value;
            },
            returnPressed: () => connectToDevice(),
          }}
          ref={ref}
          echoMode={EchoMode.Password}
        />
      </BoxView>
      <Text style="color: red;">{error}</Text>
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <Button
          on={{ clicked: () => history.replace("/sshkey", location.state) }}
          text="Use SSH Key"
        />
        <View />
        <View />
        <Button
          enabled={!!passwordRef.current}
          on={{ clicked: () => connectToDevice() }}
          text="Connect"
        />
      </BoxView>
    </BoxView>
  );
}
