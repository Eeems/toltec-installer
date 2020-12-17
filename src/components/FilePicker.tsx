import React from "react";
import { Direction, QFileDialog, FileMode, DialogCode } from "@nodegui/nodegui";
import { LineEdit, Button, BoxView } from "@nodegui/react-nodegui";

export default function FilePicker({
  selectedFiles = "",
  filter = "",
  fileMode = FileMode.AnyFile,
  onChange = (x: string) => {},
}) {
  const selectedFilesRef = React.useRef(selectedFiles);
  const onTextChanged = (value) => {
    selectedFilesRef.current = value;
    onChange(value);
  };
  console.log(fileMode);
  const onClicked = () => {
    const fileDialog = new QFileDialog();
    fileMode && fileDialog.setFileMode(fileMode);
    filter && fileDialog.setNameFilter(filter);
    if (fileDialog.exec() == DialogCode.Accepted) {
      onTextChanged(fileDialog.selectedFiles().join(", "));
    }
  };
  return (
    <BoxView id="bottomBar" direction={Direction.LeftToRight}>
      <LineEdit text={selectedFiles} on={{ textChanged: onTextChanged }} />
      <Button text="Browse" on={{ clicked: onClicked }} />
    </BoxView>
  );
}
