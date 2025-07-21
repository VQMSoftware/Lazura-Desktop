import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // General send method with optional data
  send: (channel: string, data?: any) => {
    const validChannels = [
      'navigate-to-url',
      'go-back',
      'go-forward',
      'reload',
      'create-web-contents-view',
      'select-web-contents-view',
      'close-web-contents-view',
      'window-minimize',
      'window-maximize',
      'window-close',
      'get-navigation-state',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // Listener for main-to-renderer events
  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = [
      'tab-update',
      'tab-favicon-update',
      'create-tab',
      'tab-selected',
      'navigation-state-changed',
    ];
    if (validChannels.includes(channel)) {
      const listener = (_event: any, ...args: any[]) => callback(...args);
      ipcRenderer.on(channel, listener);
      return listener;
    }
  },

  // Remove listener
  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.off(channel, callback);
  },

  // Tab control helpers
  sendCreateWebContentsView: (id?: number) => {
    ipcRenderer.send('create-web-contents-view', id);
  },
  sendSelectWebContentsView: (id: number) => {
    ipcRenderer.send('select-web-contents-view', id);
  },
  sendCloseWebContentsView: (id: number) => {
    ipcRenderer.send('close-web-contents-view', id);
  },

  // Navigation helpers
  sendNavigateToUrl: (id: number, url: string) => {
    ipcRenderer.send('navigate-to-url', { id, url });
  },
  sendGoBack: (id: number) => {
    ipcRenderer.send('go-back', id);
  },
  sendGoForward: (id: number) => {
    ipcRenderer.send('go-forward', id);
  },
  sendReload: (id: number) => {
    ipcRenderer.send('reload', id);
  },

  // Window controls
  minimizeWindow: () => {
    ipcRenderer.send('window-minimize');
  },
  maximizeWindow: () => {
    ipcRenderer.send('window-maximize');
  },
  closeWindow: () => {
    ipcRenderer.send('window-close');
  },

  // Sync method to get current tab ID
  getCurrentTabId: (): number => {
    return ipcRenderer.sendSync('get-current-tab-id');
  },

  getTabUrlSync: (id: number): string => {
    return ipcRenderer.sendSync('get-tab-url-sync', id) || '';
  },

  // Async method to get navigation state
  getNavigationState: (id: number) => {
    return ipcRenderer.invoke('get-navigation-state', id);
  },

  // Listen to navigation state change
  onNavigationStateChange: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('navigation-state-changed', listener);
    return () => ipcRenderer.off('navigation-state-changed', listener);
  },
});
