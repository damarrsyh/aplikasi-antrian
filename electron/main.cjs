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

  win.loadURL('http://192.168.4.138:5173'); // saat development
  // win.webContents.openDevTools();
}

// 🖨 Simpan ke PDF (sementara pengganti print langsung)
ipcMain.handle('print-ticket', async (event, ticketHTML) => {
  const win = new BrowserWindow({
    show: false, // tidak tampil di layar
    webPreferences: {
      offscreen: true, // render di background
    },
  });

  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(ticketHTML)}`);

  const pdfPath = path.join(app.getPath('documents'), `tiket-antrian-${Date.now()}.pdf`);
  
  try {
    const pdfBuffer = await win.webContents.printToPDF({
      marginsType: 1,
      printBackground: true,
      pageSize: 'A6', // atau 'A5', 'A4', sesuai ukuran tiket
    });

    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log("✅ PDF tiket berhasil dibuat di:", pdfPath);

    await win.close();
    return pdfPath;
  } catch (error) {
    console.error("❌ Gagal membuat PDF:", error);
    return null;
  }
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
