const { app, BrowserWindow } = require('electron')
const controls = require('./hardware.js');
const network = require('./network.js');
const config = require('./config.json');

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

    switch(config.station.trim()){
        case("helm"):{
            win.loadFile('www/helm.html');
            break;
        }
        default:{
            // and load the index.html of the app.
            win.loadFile('www/index.html');
            break;
        }
    }

    // Open the DevTools.
    win.webContents.openDevTools()
    
}

app.on('ready', createWindow)