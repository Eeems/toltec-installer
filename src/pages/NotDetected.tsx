import React from "react";
import { Text, View, Button } from "@nodegui/react-nodegui";
import { useHistory, useParams, useLocation } from "react-router";
import { QPushButtonSignals } from "@nodegui/nodegui";

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
    <View
      style={`
        height: '100%';
        align-items: 'center';
        justify-content: 'center';
      `}
    >
      <Text>Device not detected</Text>
      <Text>Connect your reMarkable to your computer and try again.</Text>
      <Button on={{ clicked: handleClick }} text="Try again"></Button>
    </View>
  );
}
