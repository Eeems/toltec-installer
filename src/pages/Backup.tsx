import React from "react";
import { Text, View, Button, ProgressBar } from "@nodegui/react-nodegui";
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
  }, []);
  const device = location.state.device;
  return (
    <View style="flex: 1;">
      <Text>Backing up your reMarkable {device[device.length - 1]}...</Text>
      <Spacer />
      <ProgressBar value={state.value} />
      <Text>
        {state.done}/{state.total}
      </Text>
      <View id="bottomBar">
        <Button
          on={{
            clicked: () => {
              cancelCopy();
              history.replace("/install", location.state);
            },
          }}
          text="Cancel"
        />
        <Spacer />
        <Button
          enabled={state.finished}
          on={{ clicked: () => history.replace("/install", location.state) }}
          text="Next"
        />
      </View>
    </View>
  );
}
