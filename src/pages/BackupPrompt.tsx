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
  const [backupLocation, setBackupLocation] = React.useState("/tmp/rm-backup");
  const location = useLocation();
  const history = useHistory();
  const device = location.state.device;
  const onChange = (value) => {
    setBackupLocation(value);
    history.replace(
      `/backupprompt`,
      Object.assign(location.state, { backupLocation: value })
    );
  };
  return (
    <BoxView direction={Direction.TopToBottom}>
      <View>
        <Text style="vertical-align: 'text-top';">
          Backup your reMarkable {device[device.length - 1]}?
        </Text>
      </View>
      <FilePicker
        selectedFiles={backupLocation}
        fileMode={FileMode.Directory}
        onChange={onChange}
      />
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <View />
        <View />
        <Button
          on={{ clicked: () => history.replace("/install", location.state) }}
          text="Skip"
        />
        <Button
          on={{ clicked: () => history.replace("/backup", location.state) }}
          text="Backup"
        />
      </BoxView>
    </BoxView>
  );
}
