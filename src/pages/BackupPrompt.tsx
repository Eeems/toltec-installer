import React, { useState } from "react";
import { Text, View, Button, ProgressBar } from "@nodegui/react-nodegui";
import { useHistory, useLocation } from "react-router";
import { exec, disconnect } from "../ssh";
import Spacer from "../components/Spacer";

export default function BackupPrompt() {
  const location = useLocation();
  const history = useHistory();
  const device = location.state.device;
  return (
    <View>
      <Text>Backup your reMarkable {device[device.length - 1]}?</Text>
      <Spacer />
      <View id="bottomBar">
        <Spacer />
        <Button
          on={{ clicked: () => history.replace("/install", location.state) }}
          text="Skip"
        />
        <Button
          on={{ clicked: () => history.replace("/backup", location.state) }}
          text="Backup"
        />
      </View>
    </View>
  );
}
