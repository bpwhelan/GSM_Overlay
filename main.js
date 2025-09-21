const { app, BrowserWindow, session, screen, globalShortcut } = require('electron');
const { ipcMain } = require("electron");
const fs = require("fs");
const path = require('path');

const settingsPath = path.join(app.getPath('userData'), 'settings.json');
let shiftSpacePressed = false;
let ext;
let userSettings = {
  "fontSize": 42,
  "weburl1": "ws://localhost:55002",
  "weburl2": "ws://localhost:55499",
  "hideOnStartup": false,
  "magpieCompatibility": false
};

if (fs.existsSync(settingsPath)) {
  try {
    const data = fs.readFileSync(settingsPath, "utf-8");
    oldUserSettings = JSON.parse(data)
    userSettings = { ...userSettings, ...oldUserSettings }

  } catch (error) {
    console.error("Failed to load settings.json:", e)

  }
}

function openYomitanSettings() {
  const yomitanOptionsWin = new BrowserWindow({
      width: 1100,
      height: 600,
      webPreferences: {
        nodeIntegration: false
      }
    });

    yomitanOptionsWin.removeMenu()
    yomitanOptionsWin.loadURL(`chrome-extension://${ext.id}/settings.html`);
    // Allow search ctrl F in the settings window
    yomitanOptionsWin.webContents.on('before-input-event', (event, input) => {
      if (input.key.toLowerCase() === 'f' && input.control) {
        yomitanOptionsWin.webContents.send('focus-search');
        event.preventDefault();
      }
    });
}

app.whenReady().then(async () => {
  const isDev = !app.isPackaged;
  const extPath = isDev ? path.join(__dirname, 'yomitan') : path.join(process.resourcesPath, "yomitan")
  try {
    ext = await session.defaultSession.loadExtension(extPath, { allowFileAccess: true });
    console.log('Yomitan extension loaded.');

  } catch (e) {
    console.error('Failed to load extension:', e);
  }

  globalShortcut.register('Alt+Shift+H', () => {
    // Send a message to the renderer process to toggle the main box
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      win.webContents.send('toggle-main-box');
    }
  });

  globalShortcut.register('Alt+Shift+J', () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) {
        win.restore();
        win.blur();
      }
      else win.minimize();
    }
  });

  globalShortcut.register('Alt+Shift+Y', () => {
    openYomitanSettings();
  });


  
  // // Shift+Space enters "shiftSpace mode" on press, exits on release.
  // globalShortcut.register('Shift+Space', () => {
  //   const win = BrowserWindow.getAllWindows()[0];
  //   if (win && !shiftSpacePressed) {
  //     shiftSpacePressed = true;
  //     win.webContents.send('shift-space-mode', true); // Enter mode
  //   }
  // });

  // globalShortcut.register('Shift+Space', () => {}, () => {
  //   const win = BrowserWindow.getAllWindows()[0];
  //   if (win && shiftSpacePressed) {
  //     win.webContents.send('shift-space-mode', false); // Exit mode
  //   }
  // });

  // // On press down, toggle overlay on top and focused, on release, toggle back
  // globalShortcut.register('O', () => {
  //   if (win) {
  //     win.setAlwaysOnTop(true, 'screen-saver');
  //     win.focus();
  //   }
  // }, () => {
  //   if (win) {
  //     win.setAlwaysOnTop(false);
  //   }
  // });

  // Unregister shortcuts on quit
  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });

  const display = screen.getPrimaryDisplay()
  const workArea = display.workArea

  const win = new BrowserWindow({
    x: workArea.x,
    y: workArea.y,
    width: workArea.width + 1,
    height: workArea.height + 1,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    titleBarStyle: 'hidden',
    title: "",
    // focusable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    },
    show: false,
  });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver");
  let resizeMode = false;
  let yomitanShown = false;
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    console.log("set-ignore-mouse-events", ignore, options, resizeMode, yomitanShown);
    if (!resizeMode && !yomitanShown) {
      win.setIgnoreMouseEvents(ignore, options)
    }
    // if (ignore) {
    //   win.blur();
    // }
  })

  ipcMain.on("hide", (event, state) => {
    win.minimize();
  });

  ipcMain.on("show", (event, state) => {
    win.show();
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  });

  ipcMain.on("resize-mode", (event, state) => {
    resizeMode = state;
  })


  ipcMain.on("yomitan-event", (event, state) => {
    yomitanShown = state;
    if (state) {
      win.setIgnoreMouseEvents(false, { forward: true });
      // win.setAlwaysOnTop(true, 'screen-saver');
    } else {
      win.setIgnoreMouseEvents(true, { forward: true });
      // win.setAlwaysOnTop(true, 'screen-saver');
      win.blur();
      // Blur again after a short delay to ensure it takes effect
      setTimeout(() => {
        if (!resizeMode && !yomitanShown) {
          win.blur();
        }
      }, 100);
    }
  })

  ipcMain.on('release-mouse', () => {
    win.blur();
    setTimeout(() => win.focus(), 50);
  });


  // Fix for ghost title bar
  // https://github.com/electron/electron/issues/39959#issuecomment-1758736966
  win.on('blur', () => {
    win.setBackgroundColor('#00000000')
  })

  win.on('focus', () => {
    win.setBackgroundColor('#00000000')
  })

  win.loadFile('index.html');
  if (isDev) {
    win.webContents.on('context-menu', () => {
      win.webContents.openDevTools({ mode: 'detach' });

    });
  }
  win.once('ready-to-show', () => {
    win.show();
    if (isDev) {
      win.openDevTools({ mode: 'detach' });
    }
    win.webContents.send("load-settings", userSettings);
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setIgnoreMouseEvents(true, { forward: true });
  });

  ipcMain.on("app-close", () => {
    app.quit();
  });

  ipcMain.on("app-minimize", () => {
    win.minimize();
  });

  ipcMain.on("open-yomitan-settings", () => {
    openYomitanSettings();
  });

  let websocketStates = {
    "ws1": false,
    "ws2": false
  }
  ipcMain.on("websocket-closed", (event, type) => {
    websocketStates[type] = false
  });
  ipcMain.on("websocket-opened", (event, type) => {
    websocketStates[type] = true
  });

  ipcMain.on("open-settings", () => {
    if (win && !win.isDestroyed()) {
      win.webContents.send("force-visible", true); // ✅ Show overlay
    }
    win.webContents.send("request-current-settings");
    ipcMain.once("reply-current-settings", (event, settings) => {
      const settingsWin = new BrowserWindow({
        width: 500,
        height: 400,
        resizable: true,
        alwaysOnTop: true,
        title: "Overlay Settings",
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        },
      });
      settingsWin.removeMenu()

      settingsWin.loadFile("settings.html");
      settingsWin.on("closed", () => {
        if (win && !win.isDestroyed()) {
          win.webContents.send("force-visible", false);
        }
      })
      const closedListenerFunction = (event, type) => {
        settingsWin.send("websocket-closed", type)
      }
      const openedListenerFunction = (event, type) => {
        settingsWin.send("websocket-opened", type);
      };
      ipcMain.on("websocket-closed", closedListenerFunction)
      ipcMain.on("websocket-opened", openedListenerFunction)
      console.log(websocketStates)
      settingsWin.webContents.send("preload-settings", { settings, websocketStates })

      settingsWin.on("closed", () => {
        ipcMain.removeListener("websocket-closed", closedListenerFunction)
        ipcMain.removeListener("websocket-opened", openedListenerFunction)
      })
    })


  });
  ipcMain.on("fontsize-changed", (event, newsize) => {
    win.webContents.send("new-fontsize", newsize);
    userSettings.fontSize = newsize;
  })
  ipcMain.on("weburl1-changed", (event, newurl) => {
    userSettings.weburl1 = newurl;
    win.webContents.send("new-weburl1", newurl)
  })
  ipcMain.on("weburl2-changed", (event, newurl) => {
    userSettings.weburl2 = newurl;
    win.webContents.send("new-weburl2", newurl)
  })
  ipcMain.on("hideonstartup-changed", (event, newValue) => {
    userSettings.hideOnStartup = newValue;
    win.webContents.send("new-hideonstartup", newValue);
  })
  ipcMain.on("magpieCompatibility-changed", (event, newValue) => {
    userSettings.magpieCompatibility = newValue;
    win.webContents.send("new-magpieCompatibility", newValue);
  })

  // let alwaysOnTopInterval;

  ipcMain.on("text-recieved", (event, text) => {
    // If window is minimized, restore it
    if (win.isMinimized()) {
      win.setAlwaysOnTop(true, 'screen-saver');
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    } 

    // console.log(`magpieCompatibility: ${userSettings.magpieCompatibility}`);
    if (userSettings.magpieCompatibility) {
      win.show();
      win.blur();
    }
    //   // Slightly adjust position to workaround Magpie stealing focus
    //   win.show();
    //   win.setAlwaysOnTop(true, 'screen-saver');
    //   win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    // //   const ensureOnTop = setInterval(() => {
    // //   if (win && !win.isDestroyed()) {
    // //     try {
    // //       win.setAlwaysOnTop(true, 'screen-saver');
    // //       win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    // //     } catch (error) {
    // //       console.error("Error maintaining always-on-top:", error);
    // //       clearInterval(ensureOnTop);
    // //     }
    // //   } else {
    // //     clearInterval(ensureOnTop);
    // //   }
    // // }, 100); // Check every 2 seconds instead of 100ms for better performance
    // }

    // Ensure window stays on top when text is received
    // win.setAlwaysOnTop(true, 'screen-saver');
    // win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    // Don't blur immediately - let the overlay stay accessible briefly
    // setTimeout(() => {
    //   if (!yomitanShown && !resizeMode) {
    //     win.blur();
    //   }
    // }, 100);
    
    // Periodically ensure always-on-top status is maintained
    // Some applications can steal focus and break overlay behavior
  });

  app.on("before-quit", () => {
    // clearInterval(alwaysOnTopInterval);
    fs.writeFileSync(settingsPath, JSON.stringify(userSettings, null, 2))
  });
});
