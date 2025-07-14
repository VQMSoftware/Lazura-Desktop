interface ElectronAPI {
  on: (channel: string, listener: (...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
  off?: (channel: string, listener: (...args: any[]) => void) => void;
}

interface Window {
  electron?: ElectronAPI;
}
