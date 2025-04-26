const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs ke frontend
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    // whitelist channel
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, callback) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
});
  