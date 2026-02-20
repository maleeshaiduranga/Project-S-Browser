const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sBrowser', {
  navigate: (url) => ipcRenderer.invoke('navigate', url),
  goBack: () => ipcRenderer.invoke('go-back'),
  goForward: () => ipcRenderer.invoke('go-forward'),
  refreshPage: () => ipcRenderer.invoke('refresh-page'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  extensionPath: () => ipcRenderer.invoke('extension-path'),
  listExtensions: () => ipcRenderer.invoke('list-extensions'),
  onNavigationState: (callback) => ipcRenderer.on('navigation-state', (_, state) => callback(state))
});
