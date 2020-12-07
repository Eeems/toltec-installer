import React, { useState } from "react";
import {
  Text,
  View,
  BoxView,
  Button,
  ProgressBar,
} from "@nodegui/react-nodegui";
import { Direction } from "@nodegui/nodegui";
import { useHistory, useLocation } from "react-router";
import { exec, disconnect } from "../ssh";
import Spacer from "../components/Spacer";

export default function BackupPrompt() {
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
