import { WebContentsView, BrowserWindow, ipcMain, WebContents } from 'electron';
import * as path from 'path';

/**
 * Represents a single browser tab/view within a BrowserWindow
 * Manages web content, navigation, and tab-related events
 */
export class CreateChildView {
  private view: WebContentsView;
  private id: number;
  private parentWindow: BrowserWindow;
  private isDestroyed: boolean = false;

  // Initialize a new tab/view with unique ID and parent window
  constructor(parentWindow: BrowserWindow, id: number) {
    this.id = id;
    this.parentWindow = parentWindow;

    // Create a new WebContentsView with secure default settings
    this.view = new WebContentsView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        partition: `persist:webcontents-${id}`,
        webSecurity: true,
        allowRunningInsecureContent: false,
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    this.initializeView();
    this.setupEventListeners();
  }

  // Add view to window and load initial page
  private initializeView() {
    this.parentWindow.contentView.addChildView(this.view);
    this.updateBounds();
    this.loadPage();
  }

  // Set up event listeners for web content events
  private setupEventListeners() {
    const { webContents } = this.view;

    webContents.on('did-start-navigation', (event, url, isInPlace, isMainFrame) => {
      if (this.isDestroyed || !isMainFrame) return;

      this.sendTabUpdate({
        url,
        isLoading: true,
        canGoBack: webContents.navigationHistory.canGoBack(),
        canGoForward: webContents.navigationHistory.canGoForward(),
      });
    });

    webContents.on('did-finish-load', () => {
      if (this.isDestroyed) return;

      this.updateTitle();
      this.sendTabUpdate({
        isLoading: false,
        canGoBack: webContents.navigationHistory.canGoBack(),
        canGoForward: webContents.navigationHistory.canGoForward(),
      });
    });

    webContents.on('did-fail-load', () => {
      if (this.isDestroyed) return;
      this.sendTabUpdate({ isLoading: false });
    });

    webContents.on('page-title-updated', (event, title) => {
      if (this.isDestroyed) return;
      this.sendTabUpdate({ title });
    });

    webContents.on('page-favicon-updated', (event, favicons) => {
      if (this.isDestroyed || favicons.length === 0) return;
      this.sendTabUpdate({ favicon: favicons[0] });
    });

    webContents.on('certificate-error', (event, url, error, certificate, callback) => {
      event.preventDefault();
      callback(false);
      this.sendTabUpdate({ securityStatus: 'insecure' });
    });

    // Prevent webview attachment for security
    webContents.on('did-attach-webview', (event, webContents) => {
      event.preventDefault();
    });

    // Handle navigation events
    webContents.on('did-navigate', () => {
      this.sendNavStateUpdate();
    });

    webContents.on('did-navigate-in-page', () => {
      this.sendNavStateUpdate();
    });
  }

  // Send navigation state updates
  private sendNavStateUpdate() {
    const wc = this.view.webContents;
    this.sendTabUpdate({
      canGoBack: wc.navigationHistory.canGoBack(),
      canGoForward: wc.navigationHistory.canGoForward(),
    });
  }

  // Load default page (Google) when tab is created
  private loadPage() {
    this.view.webContents.loadURL('https://google.com');
    this.sendTabUpdate({
      title: 'New Tab',
      url: '',
      isLoading: false,
      favicon: '',
    });
  }

  // Send tab state updates to the renderer process
  private sendTabUpdate(update: {
    title?: string;
    url?: string;
    isLoading?: boolean;
    canGoBack?: boolean;
    canGoForward?: boolean;
    securityStatus?: 'secure' | 'insecure' | 'neutral';
    favicon?: string;
  }) {
    if (this.isDestroyed) return;

    this.parentWindow.webContents.send('tab-update', {
      id: this.id,
      ...update,
    });
  }

  // Update tab title from page content
  private async updateTitle() {
    try {
      const title = await this.view.webContents.executeJavaScript('document.title');
      this.sendTabUpdate({
        title: title || 'New Tab',
        url: this.view.webContents.getURL(),
      });
    } catch {
      this.sendTabUpdate({
        title: 'New Tab',
        url: this.view.webContents.getURL(),
      });
    }
  }

  // Navigate to specified URL (with auto HTTPS prefix if needed)
  public loadURL(url: string) {
    if (this.isDestroyed) return;

    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
      this.view.webContents.loadURL(url);
    } catch {
      this.view.webContents.loadURL(`https://www.google.com/search?q=${encodeURIComponent(url)}`);
    }
  }

  // Navigation methods
  public goBack() {
    if (!this.isDestroyed && this.view.webContents.navigationHistory.canGoBack()) {
      this.view.webContents.navigationHistory.goBack();
    }
  }

  public goForward() {
    if (!this.isDestroyed && this.view.webContents.navigationHistory.canGoForward()) {
      this.view.webContents.navigationHistory.goForward();
    }
  }

  public reload() {
    if (!this.isDestroyed) {
      this.view.webContents.reload();
    }
  }

  // Update view dimensions when window resizes
  public updateBounds() {
    if (this.isDestroyed) return;

    const bounds = this.parentWindow.getContentBounds();
    // Adjusted for toolbar (40px top + 46px height = 86px total offset)
    this.view.setBounds({ 
      x: 0, 
      y: 87, 
      width: bounds.width, 
      height: bounds.height - 87 
    });
  }

  // Focus management
  public focus() {
    if (!this.isDestroyed) {
      this.view.webContents.focus();
    }
  }

  // Clean up and remove view
  public destroy() {
    if (this.isDestroyed) return;

    this.isDestroyed = true;
    this.parentWindow.contentView.removeChildView(this.view);
    // TODO: this.view.webContents.destroy();
  }

  // Visibility control
  public hide() {
    if (!this.isDestroyed) {
      this.parentWindow.contentView.removeChildView(this.view);
    }
  }

  public show() {
    if (!this.isDestroyed) {
      this.parentWindow.contentView.addChildView(this.view);
      this.updateBounds();
      this.focus();
    }
  }

  // Getters
  public getId(): number {
    return this.id;
  }

  public getWebContents(): WebContents {
    return this.view.webContents;
  }
}