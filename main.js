const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true
    },
    fullscreen: true,
    autoHideMenuBar: true
  })

  // and load the index.html of the app.
  win.loadFile('www/index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()
}

app.on('ready', createWindow)