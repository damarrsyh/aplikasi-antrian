// electron/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  win.loadURL('http://192.168.4.138:5174/'); // saat development
  win.webContents.openDevTools();
}

ipcMain.handle('print-ticket', async (event, ticketHTML) => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(ticketHTML));

    win.webContents.on('did-finish-load', () => {
      win.webContents.print({
        silent: false,
        printBackground: true,
      }, (success, errorType) => {
        if (!success) console.error('Print error:', errorType);
        win.close(); // tutup jendela print
      });
    });
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
