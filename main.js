// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { readExcel, generateSQL } = require('./utils');
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('process-file', (event, { filePath, customQuery }) => {
  const data = readExcel(filePath);
  const sql = generateSQL(data, customQuery);
  event.reply('sql-generated', sql);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
