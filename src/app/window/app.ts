import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const dev = process.env.NODE_ENV === 'development';

  mainWindow = new BrowserWindow({
    frame: false,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // preload: path.join(__dirname, '../preload/preload.js'), // Uncomment if you have a preload script
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
    const filePath = path.resolve(__dirname, 'app.html');

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
