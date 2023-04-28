const { contextBridge, ipcMain, ipcRenderer } = require('electron')

let loginBridge = {
  loginTool: async (chanel, data) => {
    await ipcRenderer.invoke(chanel, data)
  }
}

contextBridge.exposeInMainWorld('loginBridge', loginBridge)
