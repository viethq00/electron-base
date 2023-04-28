const { contextBridge, ipcMain, ipcRenderer } = require('electron')

let homeBridge = {
  openChrome: async (chanel, data) => {
    await ipcRenderer.invoke(chanel, data)
  }
}

contextBridge.exposeInMainWorld('homeBridge', homeBridge)
