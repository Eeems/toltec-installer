import React from "react";
import { Text, View, Button } from "@nodegui/react-nodegui";
import { useHistory, useLocation } from "react-router";
import { QPushButtonSignals } from "@nodegui/nodegui";

export default function Error() {
  const history = useHistory();
  const location = useLocation();
  function handleClick() {
    history.push("/intro");
  }
  return (
    <View
      style={`
        height: '100%';
        align-items: 'center';
        justify-content: 'center';
      `}
    >
      <Text>Something went wrong!</Text>
      <Text wordWrap={true}>{location.state.error}</Text>
      <Text>
        You may need to open an issue to get help. If you do, please include the
        following information:
      </Text>
      <Text wordWrap={true}>{JSON.stringify(location.state)}</Text>
      <Button on={{ clicked: handleClick }} text="Restart"></Button>
    </View>
  );
}
