const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;
var debug = false;

function createWindow() {
    
    win = new BrowserWindow({
        width: 800,
        height: 600
    });
    
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    if (debug) win.webContents.openDevTools();
    
    win.on('closed', function() {
        win = null;
    });
    
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if (win == null) {
        createWindow();
    }
});