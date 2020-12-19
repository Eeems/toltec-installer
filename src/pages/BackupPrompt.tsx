import React, { useState } from "react";
import {
  Text,
  View,
  BoxView,
  Button,
  ProgressBar,
} from "@nodegui/react-nodegui";
import { Direction, FileMode } from "@nodegui/nodegui";
import { useHistory, useLocation } from "react-router";
import { exec, disconnect } from "../ssh";
import Spacer from "../components/Spacer";
import FilePicker from "../components/FilePicker";

export default function BackupPrompt() {
  const backupLocationRef = React.useRef("/tmp/rm-backup");
  const location = useLocation();
  const history = useHistory();
  const device = location.state.device;
  return (
    <BoxView direction={Direction.TopToBottom}>
      <View>
        <Text style="vertical-align: 'text-top';">
          Backup your reMarkable {device[device.length - 1]}?
        </Text>
      </View>
      <FilePicker
        selectedFiles={backupLocationRef.current}
        fileMode={FileMode.Directory}
        onChange={(value) => {
          backupLocationRef.current = value;
        }}
      />
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <View />
        <View />
        <Button
          on={{ clicked: () => history.replace("/install", location.state) }}
          text="Skip"
        />
        <Button
          on={{
            clicked: () =>
              history.replace(
                "/backup",
                Object.assign(location.state, {
                  backupLocation: backupLocationRef.current,
                })
              ),
          }}
          text="Backup"
        />
      </BoxView>
    </BoxView>
  );
}
