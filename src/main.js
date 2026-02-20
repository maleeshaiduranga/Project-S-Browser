const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, BrowserView, ipcMain, session, shell } = require('electron');

const HOME_URL = 'https://www.google.com';
let win;
let view;

function getExtensionDirectory() {
  return path.join(app.getPath('userData'), 'extensions');
}

function ensureExtensionDirectory() {
  const extensionDir = getExtensionDirectory();
  fs.mkdirSync(extensionDir, { recursive: true });
  return extensionDir;
}

async function loadUnpackedExtensions() {
  const extensionDir = ensureExtensionDirectory();
  const entries = fs.readdirSync(extensionDir, { withFileTypes: true });
  const loaded = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const extPath = path.join(extensionDir, entry.name);
    try {
      const ext = await session.defaultSession.extensions.loadExtension(extPath, {
        allowFileAccess: true
      });
      loaded.push({ id: ext.id, name: ext.name, version: ext.version, path: extPath });
    } catch (error) {
      console.warn(`Failed to load extension at ${extPath}:`, error.message);
    }
  }

  return loaded;
}

function layoutBrowserView() {
  if (!win || !view) {
    return;
  }

  const bounds = win.getContentBounds();
  const topBarHeight = 116;
  view.setBounds({ x: 0, y: topBarHeight, width: bounds.width, height: Math.max(bounds.height - topBarHeight, 100) });
}

function createBrowserView() {
  view = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: false
    }
  });

  win.setBrowserView(view);
  layoutBrowserView();

  view.webContents.setWindowOpenHandler(({ url }) => {
    view.webContents.loadURL(url);
    return { action: 'deny' };
  });

  view.webContents.on('did-navigate', () => {
    emitNavigationState();
  });

  view.webContents.on('did-navigate-in-page', () => {
    emitNavigationState();
  });

  view.webContents.on('page-title-updated', () => {
    emitNavigationState();
  });

  view.webContents.on('did-start-loading', () => {
    emitNavigationState();
  });

  view.webContents.on('did-stop-loading', () => {
    emitNavigationState();
  });

  view.webContents.loadURL(HOME_URL);
}

function emitNavigationState() {
  if (!win || !view) {
    return;
  }

  const wc = view.webContents;
  win.webContents.send('navigation-state', {
    url: wc.getURL(),
    title: wc.getTitle() || 'S Browser',
    canGoBack: wc.canGoBack(),
    canGoForward: wc.canGoForward(),
    isLoading: wc.isLoading()
  });
}

function normalizeAddress(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return HOME_URL;
  }

  if (/^[a-zA-Z]+:\/\//.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes(' ') || !trimmed.includes('.')) {
    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  }

  return `https://${trimmed}`;
}

function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 960,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#0b1220',
    title: 'S Browser',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  win.on('resize', layoutBrowserView);
  win.on('maximize', layoutBrowserView);
  win.on('unmaximize', layoutBrowserView);

  createBrowserView();
}

app.whenReady().then(async () => {
  await loadUnpackedExtensions();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('navigate', (_, url) => {
  view.webContents.loadURL(normalizeAddress(url));
});

ipcMain.handle('go-back', () => {
  if (view.webContents.canGoBack()) {
    view.webContents.goBack();
  }
});

ipcMain.handle('go-forward', () => {
  if (view.webContents.canGoForward()) {
    view.webContents.goForward();
  }
});

ipcMain.handle('refresh-page', () => {
  view.webContents.reload();
});

ipcMain.handle('open-external', (_, url) => {
  shell.openExternal(url);
});

ipcMain.handle('extension-path', () => {
  return getExtensionDirectory();
});

ipcMain.handle('list-extensions', async () => {
  const loaded = session.defaultSession.extensions.getAllExtensions();
  return loaded.map((item) => ({ id: item.id, name: item.name, version: item.version }));
});
