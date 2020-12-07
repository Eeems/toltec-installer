import React from "react";
import { Text, View, BoxView, Button, LineEdit } from "@nodegui/react-nodegui";
import { Direction, CursorShape } from "@nodegui/nodegui";
import { useHistory, useLocation } from "react-router";
import Spacer from "../components/Spacer";

export default function Error() {
  const history = useHistory();
  const location = useLocation();
  function handleClick() {
    history.push("/intro");
  }
  console.log(location.state.error);
  return (
    <BoxView direction={Direction.TopToBottom}>
      <View>
        <Text>Something went wrong!</Text>
      </View>
      <Text wordWrap={true}>{location.state.error}</Text>
      <Text>
        You may need to open an issue to get help. If you do, please include the
        following information:
      </Text>
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
