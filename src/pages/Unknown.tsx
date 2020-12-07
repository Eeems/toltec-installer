import React from "react";
import { Text, View, BoxView, Button, LineEdit } from "@nodegui/react-nodegui";
import { Direction, CursorShape } from "@nodegui/nodegui";
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
    <BoxView direction={Direction.TopToBottom}>
      <View>
        <Text>Something went wrong!</Text>
      </View>
      <Text wordWrap={true}>
        The application ran into an unknown error, please open an issue and
        provide the following information:
      </Text>
      <Text>{location.pathname + location.search + location.hash}</Text>
      <LineEdit
        readOnly={true}
        cursor={CursorShape.IBeamCursor}
        text={JSON.stringify(location.state)}
      />
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <View />
        <View />
        <View />
        <Button on={{ clicked: handleClick }} text="Restart"></Button>
      </BoxView>
    </BoxView>
  );
}
