// D:\main-public-projects\Lazura-Desktop\src\electron.d.ts
interface ElectronAPI {
  // Window controls
  send: (channel: string, data?: any) => void;
  on: (channel: string, func: (...args: any[]) => void) => void;
  off: (channel: string, func: (...args: any[]) => void) => void;
  
  // Tab management
  sendCreateWebContentsView: (id?: number) => void;
  sendSelectWebContentsView: (id: number) => void;
  sendCloseWebContentsView: (id: number) => void;
  
  // Navigation controls
  sendNavigateToUrl: (id: number, url: string) => void;
  sendGoBack: (id: number) => void;
  sendGoForward: (id: number) => void;
  sendReload: (id: number) => void;
  
  // Window controls
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  
  // Utility
  getCurrentTabId: () => number | null;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}