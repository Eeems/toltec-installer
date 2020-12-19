import React from "react";
import { Direction, QFileDialog, FileMode, DialogCode } from "@nodegui/nodegui";
import { LineEdit, Button, BoxView } from "@nodegui/react-nodegui";

export default function FilePicker({
  selectedFiles = "",
  filter = "",
  fileMode = FileMode.AnyFile,
  onChange = (x: string) => {},
  onReturnPressed = () => {},
}) {
  const selectedFilesRef = React.useRef(selectedFiles);
  const timeoutRef = React.useRef(
    undefined as ReturnType<typeof setTimeout> | unknown
  );
  const onTextEdited = (value) => {};
  const onClicked = () => {
    const fileDialog = new QFileDialog();
    fileMode && fileDialog.setFileMode(fileMode);
    filter && fileDialog.setNameFilter(filter);
    if (fileDialog.exec() == DialogCode.Accepted) {
      selectedFilesRef.current = fileDialog.selectedFiles().join(", ");
      onChange(selectedFilesRef.current);
    }
  };
  return (
    <BoxView id="bottomBar" direction={Direction.LeftToRight}>
      <LineEdit
        text={selectedFiles}
        on={{
          textChanged: (value) => {
            selectedFilesRef.current = value;
            onChange(selectedFilesRef.current);
          },
          editingFinished: () => {
            console.log("Editing Finished");
            onChange(selectedFilesRef.current);
          },
          returnPressed: () => {
            console.log("Return Pressed");
            onReturnPressed();
          },
        }}
      />
      <Button text="Browse" on={{ clicked: onClicked }} />
    </BoxView>
  );
}
