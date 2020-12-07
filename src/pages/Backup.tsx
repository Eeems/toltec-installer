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
  const [state, setState] = React.useState({
    value: 0,
    total: 0,
    done: 0,
    finished: false,
  });
  const history = useHistory();
  const location = useLocation();
  React.useEffect(() => {
    console.log("Backing up...");
    if (!state.finished) {
      copy(
        "/home/root/.local/share/remarkable/",
        "/tmp/rm-backup",
        function (total: number, done: number) {
          const value = Math.round((done / total) * 100);
          setState({
            value,
            total,
            done,
            finished: state.finished,
          });
        }
      ).then(
        function () {
          setState({
            value: 100,
            total: state.total,
            done: state.done,
            finished: true,
          });
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
      <ProgressBar value={state.value} />
      <Text>
        {state.done}/{state.total || "?"}
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
          enabled={state.finished}
          on={{ clicked: () => history.replace("/install", location.state) }}
          text="Next"
        />
      </BoxView>
    </BoxView>
  );
}
