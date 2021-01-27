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

export default function Launcher() {
  const [finished, setFinished] = React.useState(false);
  const labelRef = React.createRef();
  const scrollAreaRef = React.createRef();
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    const label = labelRef.current as QLabel;
    const scrollArea = scrollAreaRef.current as QScrollArea;
    scrollArea.setAlignment(AlignmentFlag.AlignBottom);
    label.setText(`reMarkable ${device[device.length - 1]}...`);
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
    log("hello world");
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
        <Button
          //on={{ clicked: () => () }}
          text="nao"
        />
        <Button
          //on={{ clicked: () => () }}
          text="Oxide"
        />
        <Button
          //on={{ clicked: () => () }}
          text="Oxide"
        />
      </BoxView>
    </BoxView>
  );
}
