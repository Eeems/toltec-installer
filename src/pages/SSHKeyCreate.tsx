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
import FilePicker from "../components/FilePicker";
import { existsSync } from "fs";
import { homedir } from "os";

export default function SSHKeyCreate() {
  const sshKeyRef = React.useRef(homedir() + "/.ssh/id_rsa");
  const location = useLocation();
  const history = useHistory();
  const onInstallClicked = () =>
    history.replace(
      "/installsshkey",
      Object.assign(location.state, {
        sshKeyLocation: sshKeyRef.current,
      })
    );
  const sshKeyExists = existsSync(sshKeyRef.current);
  const sshPubKeyExits = existsSync(sshKeyRef.current + ".pub");
  return (
    <BoxView direction={Direction.TopToBottom}>
      <View>
        <Text style="vertical-align: 'text-top';">
          Install SSH Key on device?
        </Text>
      </View>
      <FilePicker
        selectedFiles={sshKeyRef.current}
        fileMode={FileMode.Directory}
        onChange={(value) => {
          sshKeyRef.current = value;
        }}
        onReturnPressed={onInstallClicked}
      />
      <Text visible={sshKeyExists && !sshPubKeyExits} style="color: red;">
        SSH Public key missing!
      </Text>
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <View />
        <View />
        <Button
          on={{
            clicked: () => history.replace("/backupprompt", location.state),
          }}
          text="Skip"
        />
        <Button
          on={{
            clicked: onInstallClicked,
          }}
          enabled={sshPubKeyExits || !sshKeyExists}
          text={sshKeyExists ? "Install" : "Generate"}
        />
      </BoxView>
    </BoxView>
  );
}
