import React from "react";
import { Text, View, BoxView, Button } from "@nodegui/react-nodegui";
import { Direction } from "@nodegui/nodegui";
import { useHistory, useParams, useLocation } from "react-router";
import { QPushButtonSignals } from "@nodegui/nodegui";
import Spacer from "../components/Spacer";

export default function NotDetected() {
  const history = useHistory();
  const location = useLocation();
  function handleClick() {
    history.push("/intro");
  }
  React.useEffect(() => {
    console.log("Could not connect to device...");
  }, []);
  return (
    <BoxView direction={Direction.TopToBottom}>
      <View>
        <Text>Device not detected</Text>
        <Text>Connect your reMarkable to your computer and try again.</Text>
      </View>
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <View />
        <View />
        <View />
        <Button on={{ clicked: handleClick }} text="Try again"></Button>
      </BoxView>
    </BoxView>
  );
}
