export {};

declare global {
  interface ElectronAPI {
    // Sending messages to main
    send: (channel: string, ...args: any[]) => void;

    // Listening to messages from main
    on: (channel: string, listener: (...args: any[]) => void) => void;

    // Removing listeners
    off?: (channel: string, listener: (...args: any[]) => void) => void;

    // Sync getter for the current tab ID
    getCurrentTabId: () => number;

    // Sync getter for the current tab URL (added)
    getTabUrlSync?: (id: number) => string;

    // Async getter for the navigation state
    getNavigationState: (id: number) => Promise<{
      canGoBack: boolean;
      canGoForward: boolean;
    }>;
  }

  interface Window {
    electron?: ElectronAPI;
  }
}
