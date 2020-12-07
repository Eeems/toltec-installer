import {
  Text,
  Window,
  hot,
  View,
  Button,
  useEventHandler,
} from "@nodegui/react-nodegui";
import React from "react";
import { MemoryRouter } from "react-router";
import AppRoutes from "./routes";
import "process";

type Props = {
  setState: (State) => void;
};
type State = {};
class App extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Window
        windowTitle="Toltec installer"
        minSize={{ width: 800, height: 250 }}
        styleSheet={styleSheet}
      >
        <MemoryRouter>
          <View id="rootView">
            <AppRoutes />
          </View>
        </MemoryRouter>
      </Window>
    );
  }
}
const styleSheet = `
  #rootView {
    height: '100%';
    width: '100%';
    background-color: 'red';
  }
  #rootView > * {
    flex: 1;
    flex-direction: 'column';
    background-color: 'blue';
    height: '100%';
  }
  #rootView > * > * {
    background-color: 'green';
  }
  #bottomBar {
    flex-direction: 'row';
    justify-content: 'space-between';
    padding: 5px;
  }
`;
export default hot(App);
