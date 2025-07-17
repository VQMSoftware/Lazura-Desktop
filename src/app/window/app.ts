import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

// Set app name (important for macOS menu bar and some system UIs)
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

function loadWindowState(): { width: number; height: number; x?: number; y?: number } {
  try {
    const data = fs.readFileSync(windowStatePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return { width: 750, height: 580 };
  }
}

function saveWindowState(win: BrowserWindow) {
  const bounds = win.getBounds();
  fs.writeFileSync(windowStatePath, JSON.stringify(bounds, null, 2), 'utf8');
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
    minWidth: savedState.width,
    minHeight: savedState.height,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'window-preload.bundle.js'),
      sandbox: true,
    },
  });

  mainWindow.on('resize', () => saveWindowState(mainWindow!));
  mainWindow.on('move', () => saveWindowState(mainWindow!));

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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
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
