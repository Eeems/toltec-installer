import React from "react";
import {
  Text,
  View,
  BoxView,
  Button,
  PlainTextEdit,
  ScrollArea,
} from "@nodegui/react-nodegui";
import {
  Direction,
  ScrollBarPolicy,
  QLabel,
  QScrollArea,
  AlignmentFlag,
} from "@nodegui/nodegui";
import { useHistory, useLocation } from "react-router";
import { exec } from "../ssh";
import Spacer from "../components/Spacer";
import { nextTick } from "process";

export default function Backup() {
  const [finished, setFinished] = React.useState(false);
  const labelRef = React.createRef();
  const scrollAreaRef = React.createRef();
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    const label = labelRef.current as QLabel;
    const scrollArea = scrollAreaRef.current as QScrollArea;
    scrollArea.setAlignment(AlignmentFlag.AlignBottom);
    label.setText(
      `Installing toltec onto your reMarkable ${device[device.length - 1]}...`
    );
    function log(text: string) {
      text = (text + "")
        .trim()
        .replace(
          /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
          ""
        );
      if (text.length) {
        console.log(text);
        label.setText((label.text().trim() + "\n" + text).trim() + "\n");
        nextTick(() =>
          scrollArea.ensureVisible(0, scrollArea.maximumSize().height(), 0, 0)
        );
      }
    }
    (async function () {
      let res = await exec(`[ -d ~/.entware ]`);
      if (res.code === 0) {
        log("Entware install detected!");
      }
      res = await exec(`[ -f ~/bootstrap ]`);
      if (res.code !== 0) {
        log("Downloading bootstrap...");
        res = await exec("wget http://toltec-dev.org/bootstrap", log);
        if (res.code !== 0) {
          log("Failed to download bootstrap");
          return;
        }
      } else {
        log("Bootstrap script found.");
      }
      log("Verifying bootstrap script...");
      res = await exec(
        `echo "874e0ce8492dec1db23819a60d86e1ce24ea24ea824e9cdf1e9e863a9e1f38c9  bootstrap" | sha256sum -c`
      );
      if (res.code !== 0) {
        log("bootstrap script failed verification!");
        return;
      }
      log("Bootstrap script passed verification!");
      await exec("/bin/bash bootstrap", log);
      log("Done!");
      setFinished(true);
    })();
  }, []);
  const device = location.state.device;
  return (
    <BoxView direction={Direction.TopToBottom}>
      <ScrollArea ref={scrollAreaRef}>
        <Text ref={labelRef} style="background-color: black; color: white;" />
      </ScrollArea>
      <View />
      <BoxView direction={Direction.LeftToRight}>
        <View />
        <View />
        <View />
        <Button
          enabled={finished}
          on={{ clicked: () => history.replace("/launcher", location.state) }}
          text="Next"
        />
      </BoxView>
    </BoxView>
  );
}
