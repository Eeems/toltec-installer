import React from "react";
import { Text, View, Button } from "@nodegui/react-nodegui";
import { useHistory, useLocation } from "react-router";
import { QPushButtonSignals } from "@nodegui/nodegui";
import Spacer from "../components/Spacer";

export default function Error() {
  const history = useHistory();
  const location = useLocation();
  function handleClick() {
    history.push("/intro");
  }
  console.log(location.state.error);
  return (
    <View>
      <Text>Something went wrong!</Text>
      <Text wordWrap={true}>{location.state.error}</Text>
      <Text>
        You may need to open an issue to get help. If you do, please include the
        following information:
      </Text>
      <Text wordWrap={true}>{JSON.stringify(location.state)}</Text>
      <Spacer />
      <View id="bottomBar">
        <Spacer />
        <Button on={{ clicked: handleClick }} text="Restart"></Button>
      </View>
    </View>
  );
}
