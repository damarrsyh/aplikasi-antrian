// preload.js
const { contextBridge, ipcRenderer } = require('electron');
console.log("✅ Preload loaded");
contextBridge.exposeInMainWorld('electronAPI', {
  printTicket: (ticketHTML) => ipcRenderer.invoke('print-ticket', ticketHTML),
});
