import React from "react";
import { Text, View, Button } from "@nodegui/react-nodegui";
import { useHistory, useParams } from "react-router";
import { QPushButtonSignals } from "@nodegui/nodegui";

export default function Error() {
  const history = useHistory();
  const { error } = useParams();
  function handleClick() {
    history.push("/intro");
  }
  React.useEffect(() => {
    console.log("Error detected...");
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
      <Text wordWrap={true}>{JSON.parse(error) || "Unknown Error"}</Text>
      <Button on={{ clicked: handleClick }} text="Restart"></Button>
    </View>
  );
}
