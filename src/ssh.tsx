import { Client, SFTPWrapper } from "ssh2";
import { Stats } from "ssh2-streams";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { homedir } from "os";

let conn;
var connected = false;
const connPromises: any[] = [];
const closePromises: any[] = [];

function connect(password?: string, sshKeyPath?: string): Promise<void> {
  if (connected) {
    return disconnect().then(() => {
      return connect(password);
    });
  }
  conn = new Client()
    .on("error", (err: any) => {
      connected = false;
      connPromises.forEach((x) => {
        !x.done && x.reject(err);
        x.done = true;
      });
      closePromises.forEach((resolve) => resolve());
      closePromises.splice(0, closePromises.length);
    })
    .on("close", () => {
      closePromises.forEach((resolve) => resolve());
      closePromises.splice(0, closePromises.length);
      connected = false;
    })
    .on("end", () => {
      closePromises.forEach((resolve) => resolve());
      closePromises.splice(0, closePromises.length);
      connected = false;
    })
    .on("ready", () => {
      connected = true;
      connPromises.forEach((x) => {
        x.done = true;
        x.resolve();
      });
    });
  var config: any = {
    host: "10.11.99.1",
    port: 22,
    username: "root",
    readyTimeout: 2 * 1000, // 2 seconds
    keepaliveInterval: 1000, // 1 second
    keepaliveCountMax: 2,
  };
  if (password) {
    console.log("Using password");
    config.password = password;
  } else if (sshKeyPath) {
    console.log(`Using explicit SSH key: ${sshKeyPath}`);
    config.privateKey = readFileSync(sshKeyPath);
  } else if (existsSync(homedir() + "/.ssh/id_rsa")) {
    console.log("Using default SSH key");
    config.privateKey = readFileSync(homedir() + "/.ssh/id_rsa");
  }
  const handlers = {
    resolve: function () {},
    reject: function (err: Error) {},
    done: false,
  };
  const promise = new Promise<void>((resolve, reject) => {
    handlers.resolve = resolve;
    handlers.reject = reject;
    if (connected) {
      handlers.done = true;
      resolve();
      return;
    }
    try {
      conn.connect(config);
    } catch (error) {
      reject(error);
    }
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

function exec(
  command: string,
  onData: (d: string) => void = () => {}
): Promise<any> {
  return new Promise(function (resolve, reject) {
    if (!connected) {
      reject("Not connected");
      return;
    }
    conn.exec(command, function (err: any, stream: any) {
      if (err) {
        reject(err);
        return;
      }
      const stdout: any[] = [];
      const stderr: any[] = [];
      stream
        .on("close", function (code: any, signal: any) {
          resolve({ stdout, stderr, code, signal });
        })
        .on("data", function (data: any) {
          stdout.push(data);
          onData(data);
        })
        .stderr.on("data", function (data: any) {
          stderr.push(data);
          onData(data);
        });
    });
  });
}

function copyStructure(
  sftp: SFTPWrapper,
  from: string,
  to: string
): Promise<any> {
  return new Promise(function (resolve, reject) {
    if (!connected) {
      reject("Not connected");
      return;
    }
    try {
      if (!existsSync(to)) {
        mkdirSync(to);
      }
    } catch (e) {
      console.log(`copyStructure(${from}, ${to}): failed`);
      reject(e);
      return;
    }
    sftp.readdir(from, function (err: Error | undefined, list: any) {
      if (err) {
        reject(err);
        return;
      }
      Promise.allSettled(
        list.map(function (item) {
          const fromPath = from + "/" + item.filename,
            toPath = to + "/" + item.filename;
          return new Promise(function (resolve, reject) {
            sftp.stat(
              fromPath,
              function (err: Error | undefined, stats: Stats) {
                if (err) {
                  reject(err);
                  return;
                }
                if (stats.isDirectory()) {
                  copyStructure(sftp, fromPath, toPath).then(resolve, reject);
                  return;
                } else {
                  resolve({ fromPath, toPath });
                }
              }
            );
          });
        })
      ).then((items: any) => {
        const errors = [
          ...new Set(
            items
              .filter((x) => x.status == "rejected")
              .map((x) => "" + x.reason)
          ),
        ];
        if (errors.length) {
          console.log(`copyStructure(${from}, ${to}): failed`);
          console.error(errors.join("\n"));
          reject(errors.join("\n"));
          return;
        }
        resolve(items.map((x) => x.value).flat());
      }, reject);
    });
  });
}

const copyThreads: any[] = [];
let copyPromise: Promise<void> | undefined = undefined;

function copyThread(
  sftp: SFTPWrapper,
  from: string,
  to: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    sftp.fastGet(from, to, function (err) {
      if (err) {
        console.log(`copyItem(${from}, ${to}): failed`);
        console.error(err);
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function startCopy() {
  if (!copyPromise) {
    copyPromise = new Promise(async (finalResolve) => {
      const threads: Promise<void>[] = [];
      while (copyThreads.length) {
        while (copyThreads.length && threads.length < 5) {
          let [sftp, from, to, resolve, reject] = copyThreads.pop();
          threads.push(copyThread(sftp, from, to).then(resolve, reject));
        }
        await Promise.allSettled(threads);
        threads.splice(0, threads.length);
      }
      copyPromise = undefined;
      finalResolve();
    });
  }
}

function cancelCopy() {
  while (copyThreads.length) {
    let [sftp, from, to, resolve, reject] = copyThreads.pop();
    resolve("Cancelled");
  }
}

function copyItem(sftp: SFTPWrapper, from: string, to: string): Promise<void> {
  return new Promise((resolve, reject) => {
    copyThreads.push([sftp, from, to, resolve, reject]);
    startCopy();
  });
}

function copy(from: string, to: string, progress: any): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!connected) {
      console.log(`copy(${from}, ${to}): failed`);
      reject("Not connected");
      return;
    }
    if (!from || !to) {
      console.log(`copy(${from}, ${to}): failed`);
      reject("Invalid paths");
      return;
    }
    conn.sftp(function (err: Error | undefined, sftp: SFTPWrapper) {
      if (err) {
        console.log(`copy(${from}, ${to}): failed`);
        reject(err);
        return;
      }
      copyStructure(sftp, from, to).then((items) => {
        const total = items.length;
        let done = 0;
        Promise.allSettled(
          items.map(({ fromPath, toPath }) => {
            return copyItem(sftp, fromPath, toPath).then(() => {
              progress(total, ++done);
            });
          })
        ).then((items: any) => {
          const errors = [
            ...new Set(
              items
                .filter((x) => x.status == "rejected")
                .map((x) => x.reason + "")
            ),
          ];
          if (errors.length) {
            console.log(`copyStructure(${from}, ${to}): failed`);
            console.error(errors.join("\n"));
            reject(errors.join("\n"));
            return;
          }
          resolve();
        }, reject);
      }, reject);
    });
  });
}
function isConnected(): boolean {
  return connected;
}

export { connect, disconnect, exec, copy, cancelCopy, isConnected };
