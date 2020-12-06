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
  React.useEffect(() => {
    console.log(`Unknown route`);
  }, []);
  return (
    <View
      style={`
        height: '100%';
        align-items: 'center';
        justify-content: 'center';
      `}
    >
      <Text>Error Page</Text>
      <Text>Something went wrong!</Text>
      <Text wordWrap={true}>
        The application ran into an unknown error, please open an issue and
        provide the following information:{" "}
        {location.pathname + location.search + location.hash}
      </Text>
      <Button on={{ clicked: handleClick }} text="Restart"></Button>
    </View>
  );
}
