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
import { exec, connect, disconnect } from "../ssh";
import Spacer from "../components/Spacer";
import { existsSync, writeFileSync, readFileSync } from "fs";
import keypair from "keypair";
import { ssh, pki } from "node-forge";
import { hostname, userInfo } from "os";

export default function InstallSSHKey() {
  const [text, setText] = React.useState("Preparing...");
  const [done, setDone] = React.useState(false);
  const location = useLocation();
  const history = useHistory();
  const [sshKeyExists, setSshKeyExists] = React.useState(false);
  const sshKeyExistsRef = React.useRef(sshKeyExists);
  const checkSSHKey = () => {
    sshKeyExistsRef.current = existsSync(location.state.sshKeyLocation);
    setSshKeyExists(sshKeyExistsRef.current);
  };
  const sshPublicKeyLocation = location.state.sshKeyLocation + ".pub";
  const log = (text) => {
    setText(text);
    console.log(text);
  };
  React.useEffect(() => {
    async function generateSSHKey() {
      log("Generating SSH key...");
      const pair = keypair({ bits: 3072 });
      const privateKey = ssh.privateKeyToOpenSSH(
        pki.privateKeyFromPem(pair.private)
      );
      log("Saving private key...");
      writeFileSync(location.state.sshKeyLocation, privateKey);
      const publicKey = ssh.publicKeyToOpenSSH(
        pki.publicKeyFromPem(pair.public),
        `${userInfo().username}@${hostname()}`
      );
      log("Saving public key...");
      writeFileSync(sshPublicKeyLocation, publicKey);
      log("SSH key generated!");
    }
    async function installSSHKey() {
      log("Installing SSH key...");
      const publicKey = readFileSync(sshPublicKeyLocation);
      await exec("mkdir -p ~/.ssh");
      await exec("umask 0077 && touch ~/.ssh/authorized_keys");
      log("Checking if SSH key is installed...");
      if (
        !(await exec(`cat ~/.ssh/authorized_keys | grep "${publicKey}"`)).stdout
          .join("")
          .trim().length
      ) {
        await exec(`echo "${publicKey}" >> ~/.ssh/authorized_keys`);
        log("SSH key installed!");
      } else {
        log("SSH key already installed!");
      }
    }
    (async function () {
      try {
        checkSSHKey();
        if (!sshKeyExistsRef.current) {
          await generateSSHKey();
          checkSSHKey();
        }
        await installSSHKey();
        log("Reconnecting...");
        await disconnect();
        await connect(undefined, location.state.sshKeyLocation);
        log("SSH key installed, reconnection successful!");
        setDone(true);
      } catch (error) {
        if (
          ("" + error).trim() ==
          "Error detected: Error: All configured authentication methods failed"
        ) {
          log("Failed to connect with installed SSH key!");
          return;
        }
        history.replace(
          `/error`,
          Object.assign(location.state || {}, { error })
        );
      }
    })();
  }, []);
  return (
    <BoxView direction={Direction.TopToBottom}>
      <Text style="vertical-align: 'text-top';">{text}</Text>
      <View />
      <BoxView id="bottomBar" direction={Direction.LeftToRight}>
        <View />
        <View />
        <Button
          enabled={done}
          on={{
            clicked: () => history.replace("/backupprompt", location.state),
          }}
          text="Next"
        />
      </BoxView>
    </BoxView>
  );
}
