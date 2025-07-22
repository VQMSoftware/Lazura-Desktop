import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { contentManager } from '@/app/exports';

let mainWindow: BrowserWindow | null = null;
let ContentManager: contentManager;

app.setName('Lazura');

function getIconPath(): string {
  const platform = process.platform;
  const projectRoot = path.resolve(__dirname, '..');
  const iconDir = path.join(projectRoot, 'static', 'app_icon');

  let iconFile = 'icon.png';
  if (platform === 'win32') {
    iconFile = 'icon.ico';
  } else if (platform === 'darwin') {
    iconFile = 'icon.icns';
  }

  return path.join(iconDir, iconFile);
}

const windowStatePath = path.join(app.getPath('userData'), 'window-state.json');

function loadWindowState(): {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized?: boolean;
} {
  try {
    const data = fs.readFileSync(windowStatePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return { width: 750, height: 580 };
  }
}

function saveWindowState(win: BrowserWindow) {
  const bounds = win.getBounds();
  const isMaximized = win.isMaximized();
  const state = { ...bounds, isMaximized };
  fs.writeFileSync(windowStatePath, JSON.stringify(state, null, 2), 'utf8');
}

function createWindow() {
  const dev = process.env.NODE_ENV === 'development';
  const iconPath = getIconPath();
  const savedState = loadWindowState();

  mainWindow = new BrowserWindow({
    title: 'Lazura',
    frame: false,
    width: savedState.width,
    height: savedState.height,
    x: savedState.x,
    y: savedState.y,
    minWidth: 400,
    minHeight: 300,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'window-preload.bundle.js'),
      sandbox: true,
    },
  });

  ContentManager = new contentManager(mainWindow);

  // Restore maximized state if previously maximized
  if (savedState.isMaximized) {
    mainWindow.maximize();
  }

  // Window event handlers
  mainWindow.on('resize', () => {
    if (mainWindow && !mainWindow.isMaximized()) {
      saveWindowState(mainWindow);
    }
    mainWindow?.webContents.send('window-resized');
  });

  mainWindow.on('move', () => {
    if (mainWindow && !mainWindow.isMaximized()) {
      saveWindowState(mainWindow);
    }
  });

  mainWindow.on('maximize', () => {
    if (mainWindow) {
      saveWindowState(mainWindow);
      mainWindow.webContents.send('window-maximized');
    }
  });

  mainWindow.on('unmaximize', () => {
    if (mainWindow) {
      saveWindowState(mainWindow);
      mainWindow.webContents.send('window-unmaximized');
    }
  });

  if (dev) {
    mainWindow
      .loadURL('http://localhost:8080/app.html')
      .then(() => mainWindow?.webContents.openDevTools({ mode: 'detach' }))
      .catch((err) => console.error('❌ Failed to load dev URL:', err));
  } else {
    const appHtmlPath = path.join(__dirname, '..', 'build', 'app.html');

    if (!fs.existsSync(appHtmlPath)) {
      console.error(`❌ app.html not found at ${appHtmlPath}`);
    }

    mainWindow
      .loadFile(appHtmlPath)
      .catch((err) => console.error('❌ Failed to load app.html:', err));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (!mainWindow?.isDestroyed()) {
      ContentManager?.destroyAllViews();
    }
    app.quit();
  }
});

// Window control IPC handlers
ipcMain.on('window-close', () => {
  mainWindow?.close();
});

ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window-maximize', () => {
  if (!mainWindow) return;

  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    mainWindow.webContents.send('window-unmaximized');
  } else {
    mainWindow.maximize();
    mainWindow.webContents.send('window-maximized');
  }
});
