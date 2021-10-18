"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
// import PHE from "print-html-element";

//
const isDevelopment = process.env.NODE_ENV !== "production";

log.transports.file.level = "info";
autoUpdater.logger = log;
log.info("App starting...");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    // fullscreen: true,
    // fullscreenable: true,
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, "../public/favicon.ico"),
    titleBarStyle: "hiddenInset",
    frame: false,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: false,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    // win.webContents.openDevTools()
    win.loadURL("app://./index.html");
  }

  //
  // auto update
  //
  function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send("message", text);
  }
  autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow("Revisando actualizaciones..");
  });

  autoUpdater.on("update-available", () => {
    sendStatusToWindow("Actualizacion disponible.");
  });

  autoUpdater.on("error", (err) => {
    sendStatusToWindow(`Hubo un error en la actualizacion: ${err}`);
  });

  autoUpdater.on("download-progress", (progressObj) => {
    let log_message = `Velicidad: ${formatBytes(
      progressObj.bytesPerSecond
    )} - Descargando ${parseInt(progressObj.percent)}%`;
    // (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
  });

  autoUpdater.on("update-not-available", () => {
    sendStatusToWindow("Aplicacion Actualizada.");
  });

  autoUpdater.on("update-downloaded", () => {
    sendStatusToWindow("Descarga finalizada. El programa se cerrara en 5 seg.");
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 5000);
  });

  //

  //windows
  ipcMain.on("MinimizeWindows", () => {
    win.minimize();
  });

  ipcMain.on("MaximizeWindows", () => {
    if (win.isMaximized()) return win.restore();
    else return win.maximize();
  });

  ipcMain.on("closeWindowsApp", () => {
    app.exit(0);
  });

  //version
  ipcMain.on("app_version", (event) => {
    event.sender.send("app_version", { version: app.getVersion() });
  });

  ipcMain.on("printing", (event, arg) => {
    for (let i = 0; i < arg.length; i++) {
      // console.log(arg[i].name, arg[i].price, arg[i].quantity);
      // win.webContents.printToPDF
      win.webContents.print(
        {
          silent: true,
          copies: 1,
        },
        (success) => {
          if (success) {
            console.log("imprimir");
            // PHE.printHtml(
            //   "<div style='display: flex; align-items: center; flex-direction: column; flex-wrap: wrap; margin-left: -40px; margin: 0px; padding: 0px 0px 0px 0px'><h1 style='margin: 0px; margin-bottom: 0px; padding: 0px 0px 0px 0px'>$ " +
            //     arg[i].price +
            //     "</h1><span style='font-size:18px;text-transform: uppercase; margin: 0px; padding: 0px 0px 0px 0px 0px; text-align: center'>" +
            //     arg[i].name +
            //     "</span></div>"
            // );
          }
        }
      );
    }
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  // const options = {
  //   silent: true,
  //   deviceName: 'Monarch 9416 XL (203 dpi)',
  //   pageRanges: [{
  //     from: 0,
  //     to: 1
  //   }]
  // }
  // win.webContents.print({silent: true});

  autoUpdater.checkForUpdatesAndNotify();
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
