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
        windowTitle="Hello World!"
        minSize={{ width: 800, height: 250 }}
        styleSheet={styleSheet}
      >
        <MemoryRouter>
          <View style={containerStyle}>
            <AppRoutes />
          </View>
        </MemoryRouter>
      </Window>
    );
  }
}

const containerStyle = `
  flex: 1;
  height: '100%';
`;

const styleSheet = `
`;

export default hot(App);
