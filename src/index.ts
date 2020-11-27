import {
  QMainWindow,
  QWidget,
  QLabel,
  FlexLayout,
  QPushButton,
  QIcon,
} from "@nodegui/nodegui";
import logo from "../assets/logox200.png";
import { connect, disconnect, exec } from "./ssh.ts";

const win = new QMainWindow();
win.setWindowTitle("Hello World");
win.setStyleSheet(
  `
    #myroot {
      background-color: #009688;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
  `
);
win.resize(400, 200);

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);
win.setCentralWidget(centralWidget);

const label = new QLabel();
label.setObjectName("mylabel");
rootLayout.addWidget(label);

const label2 = new QLabel();
label2.setInlineStyle(`
  color: red;
`);
rootLayout.addWidget(label2);

win.show();

(async function () {
  try {
    label.setText("Connecting...");
    await connect();
    label.setText("Connected!");
  } catch (err) {
    label.setText("Failed to connect.");
    label2.setText(err);
    return;
  }
  try {
    const result = await exec("uptime");
    console.log(result);
    label2.setText(result.stdout.join("\n"));
  } catch (err) {
    label2.setText("Failed to execute command.");
    console.error(err);
  } finally {
    label.setText("Disconnecting...");
    await disconnect();
    label.setText("Disconnected!");
  }
})();

(global as any).win = win;
