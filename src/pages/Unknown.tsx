import React from "react";
import { Text, View, Button } from "@nodegui/react-nodegui";
import { useHistory, useLocation } from "react-router";
import { QPushButtonSignals } from "@nodegui/nodegui";
import Spacer from "../components/Spacer";

export default function Error() {
  const history = useHistory();
  const location = useLocation();
  function handleClick() {
    history.replace("/intro");
  }
  React.useEffect(() => {
    console.log(`Unknown route`);
  }, []);
  return (
    <View>
      <Text>Something went wrong!</Text>
      <Text wordWrap={true}>
        The application ran into an unknown error, please open an issue and
        provide the following information:
      </Text>
      <Text>{location.pathname + location.search + location.hash}</Text>
      <Text wordWrap={true}>{JSON.stringify(location.state)}</Text>
      <Spacer />
      <View id="bottomBar">
        <Spacer />
        <Button on={{ clicked: handleClick }} text="Restart"></Button>
      </View>
    </View>
  );
}
