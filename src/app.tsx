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
        maxSize={{ width: 800, height: 250 }}
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
  }
  #rootView > * {
    flex: 1;
    height: '100%';
  }
  #bottomBar {
    flex: 1;
    flex-direction: 'row';
    justify-content: 'space-between';
    padding: '5px';
    max-height: '50px';
    min-height: '50px';
  }
`;
export default hot(App);
