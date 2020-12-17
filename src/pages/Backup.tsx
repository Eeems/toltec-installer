import React from "react";
import {
  Text,
  View,
  BoxView,
  Button,
  ProgressBar,
} from "@nodegui/react-nodegui";
import { Direction } from "@nodegui/nodegui";
import { useHistory, useLocation } from "react-router";
import { exec, copy, cancelCopy } from "../ssh";
import Spacer from "../components/Spacer";

export default function Backup() {
  const [currentValue, setCurrentValue] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);
  const [itemsDone, setItemsDone] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    console.log("Backing up...");
    if (!finished) {
      copy(
        "/home/root/.local/share/remarkable/",
        "/tmp/rm-backup",
        function (total: number, done: number) {
          const value = Math.round((done / total) * 100);
          setCurrentValue(value);
          total && setTotalItems(total);
          done && setItemsDone(done);
        }
      ).then(
        function () {
          setCurrentValue(100);
          setFinished(true);
        },
        function (error) {
          history.replace(
            "/error",
            Object.assign(location.state || {}, { error })
          );
        }
      );
    }
  }, []);
  const device = location.state.device;
  return (
    <BoxView direction={Direction.TopToBottom}>
      <Text>Backing up your reMarkable {device[device.length - 1]}...</Text>
      <ProgressBar value={currentValue} />
      <Text>
        {itemsDone}/{totalItems || "?"}
      </Text>
      <BoxView direction={Direction.LeftToRight}>
        <Button
          on={{
            clicked: () => {
              cancelCopy();
              history.replace("/install", location.state);
            },
          }}
          text="Cancel"
        />
        <View />
        <View />
        <Button
          enabled={finished}
          on={{ clicked: () => history.replace("/install", location.state) }}
          text="Next"
        />
      </BoxView>
    </BoxView>
  );
}
