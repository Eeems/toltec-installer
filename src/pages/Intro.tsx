import React from "react";
import { Text, View, Button } from "@nodegui/react-nodegui";
import { useHistory } from "react-router";
import { connect } from "../ssh";

export default function Error() {
  const history = useHistory();
  React.useEffect(() => {
    console.log("Connecting to device...");
    connect()
      .then(function () {
        history.push("/detect");
      })
      .catch(function (e) {
        history.push(`/error/${JSON.stringify(e + "")}`);
      });
  }, []);
  return (
    <View
      style={`
        height: '100%';
        align-items: 'center';
        justify-content: 'center';
      `}
    >
      <Text>Toltec installer</Text>
      <Text>Looking for reMarkable...</Text>
    </View>
  );
}
