const { app, BrowserWindow } = require("electron");
const path = require("path");
const os = require("os");

// ===== FIX GPU & CACHE ISSUES =====
app.commandLine.appendSwitch('disable-gpu'); // matikan akselerasi GPU
app.commandLine.appendSwitch('disable-software-rasterizer'); // hindari fallback GPU software
app.commandLine.appendSwitch('no-sandbox'); // perbolehkan akses lebih longgar (hati-hati untuk prod)
app.commandLine.appendSwitch('disable-dev-shm-usage'); // hindari masalah shared memory

// Simpan cache ke folder user yang bisa ditulis
const customUserDataPath = path.join(os.homedir(), 'MyElectronAppCache');
app.setPath('userData', customUserDataPath);

// ===================================

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"), // jika digunakan
    },
  });

  win.loadURL("http://192.168.4.138:5175"); // untuk dev
  win.webContents.openDevTools();
  // win.loadFile("dist/index.html"); // untuk produksi
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
