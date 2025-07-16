import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

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
  if (!win) return;
  const bounds = win.getBounds();
  fs.writeFileSync(windowStatePath, JSON.stringify(bounds, null, 2), 'utf8');
}

function createWindow() {
  const dev = process.env.NODE_ENV === 'development';
  const iconPath = getIconPath();
  const savedState = loadWindowState();

  const minWidth = savedState.width;
  const minHeight = savedState.height;

  mainWindow = new BrowserWindow({
    title: 'Lazura',
    frame: false,
    width: savedState.width,
    height: savedState.height,
    x: savedState.x,
    y: savedState.y,
    minWidth,
    minHeight,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'window-preload.bundle.js'),
      javascript: true,
      sandbox: true,
    },
  });

  mainWindow.on('resize', () => saveWindowState(mainWindow!));
  mainWindow.on('move', () => saveWindowState(mainWindow!));

  if (dev) {
    mainWindow
      .loadURL('http://localhost:8080')
      .then(() => {
        mainWindow?.webContents.openDevTools({ mode: 'detach' });
      })
      .catch((err) => {
        console.error('Failed to load URL:', err);
      });
  } else {
    const filePath = path.resolve(app.getAppPath(), 'app.html');
    if (!fs.existsSync(filePath)) {
      console.error(`❌ app.html not found at ${filePath}`);
    }

    mainWindow
      .loadFile(filePath)
      .catch((err) => {
        console.error('Failed to load file:', err);
      });
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

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      mainWindow.webContents.send('window-unmaximized');
    } else {
      mainWindow.maximize();
      mainWindow.webContents.send('window-maximized');
    }
  }
});
