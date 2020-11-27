import { Client } from "ssh2";
import { readFileSync } from "fs";
import { homedir } from "os";

const conn = new Client();
var connected = false;
const connPromises: any[] = [];
const closePromises: any[] = [];

conn
  .on("error", (err: any) => {
    connected = false;
    connPromises.forEach((x) => {
      !x.done && x.reject(err);
      x.done = true;
    });
  })
  .on("close", () => {
    closePromises.forEach((resolve) => resolve());
    closePromises.splice(0, closePromises.length);
  })
  .on("ready", () => {
    connected = true;
    connPromises.forEach((x) => {
      x.done = true;
      x.resolve();
    });
  });

function connect(password?: string): Promise<any> {
  var config: any = {
    host: "10.11.99.1",
    port: 22,
    username: "root",
    readyTimeout: 5 * 1000, // 5 seconds
  };
  if (password) {
    config.password = password;
  } else {
    config.privateKey = readFileSync(homedir() + "/.ssh/id_rsa");
  }
  const handlers = {
    resolve: function () {},
    reject: function () {},
    done: false,
  };
  const promise = new Promise(function (resolve, reject) {
    handlers.resolve = resolve;
    handlers.reject = reject;
    if (connected) {
      handlers.done = true;
      resolve();
      return;
    }
    conn.connect(config);
  });
  connPromises.push(handlers);
  promise.then(() => {
    const idx = connPromises.indexOf(promise);
    if (idx >= 0) {
      connPromises.splice(idx, 1);
    }
  });
  return promise;
}

async function disconnect() {
  if (!connected) {
    return;
  }
  const promise = new Promise(function (resolve) {
    closePromises.push(resolve);
    conn.end();
  });
  await promise;
}

function exec(command: string): Promise<any> {
  return new Promise(function (resolve, reject) {
    conn.exec("uptime", function (err: any, stream: any) {
      if (err) {
        reject(err);
        return;
      }
      const stdout: any[] = [];
      const stderr: any[] = [];
      stream
        .on("close", function (code: any, signal: any) {
          conn.end();
          resolve({ stdout, stderr, code, signal });
        })
        .on("data", function (data: any) {
          stdout.push(data);
        })
        .stderr.on("data", function (data: any) {
          stderr.push(data);
        });
    });
  });
}

export { connect, disconnect, exec };
