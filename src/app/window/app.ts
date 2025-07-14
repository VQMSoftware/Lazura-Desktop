import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

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

  const fullIconPath = path.join(iconDir, iconFile);

  return fullIconPath;
}

function createWindow() {
  const dev = process.env.NODE_ENV === 'development';
  const iconPath = getIconPath();

  mainWindow = new BrowserWindow({
    frame: false,
    width: 800,
    height: 600,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

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
