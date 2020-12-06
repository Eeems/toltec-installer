import React from "react";
import { Text, View, Button } from "@nodegui/react-nodegui";
import { useHistory, useLocation } from "react-router";
import { exec, disconnect } from "../ssh";

export default function Backup() {
  const history = useHistory();
  const location = useLocation();
  const device = location.state.device;
  return (
    <View
      style={`
        height: '100%';
        align-items: 'center';
        justify-content: 'center';
      `}
    >
      <Text>Backup your reMarkable {device[device.length - 1]}?</Text>
    </View>
  );
}
