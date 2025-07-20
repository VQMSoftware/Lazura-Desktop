import { BrowserWindow, ipcMain } from 'electron';
import { CreateChildView } from './content';

/**
 * ContentManager handles creation, selection, and destruction of WebContentsViews
 */
export class contentManager {
  private views: Map<number, CreateChildView> = new Map();
  private currentViewId: number | null = null;
  private nextId: number = 1;
  private parentWindow: BrowserWindow;

  constructor(parentWindow: BrowserWindow) {
    this.parentWindow = parentWindow;
    this.setupIPCHandlers();
    this.setupWindowListeners();
  }

  /**
   * Setup IPC communication with renderer process
   */
  private setupIPCHandlers() {
    // Tab management
    ipcMain.on('create-web-contents-view', (_, id?: number) => {
      this.createView(id);
    });

    ipcMain.on('select-web-contents-view', (_, id: number) => {
      this.selectView(id);
    });

    ipcMain.on('close-web-contents-view', (_, id: number) => {
      this.closeView(id);
    });

    ipcMain.on('get-current-tab-id', (event) => {
      event.returnValue = this.currentViewId;
    });

    // Navigation controls
    ipcMain.on('navigate-to-url', (_, { id, url }) => {
      this.navigateToUrl(id, url);
    });

    ipcMain.on('go-back', (_, id: number) => {
      this.goBack(id);
    });

    ipcMain.on('go-forward', (_, id: number) => {
      this.goForward(id);
    });

    ipcMain.on('reload', (_, id: number) => {
      this.reload(id);
    });

    // Navigation state handler
    ipcMain.handle('get-navigation-state', async (_event, id: number) => {
      const view = this.views.get(id);
      if (!view) {
        return { canGoBack: false, canGoForward: false };
      }

      const wc = view.getWebContents();

      return {
        canGoBack: wc.navigationHistory?.canGoBack() ?? false,
        canGoForward: wc.navigationHistory?.canGoForward() ?? false,
      };
    });
  }

  /**
   * Setup window event listeners
   */
  private setupWindowListeners() {
    this.parentWindow.on('resize', () => {
      this.views.forEach(view => view.updateBounds());
    });

    this.parentWindow.on('closed', () => {
      this.destroyAllViews();
    });
  }

  /**
   * Create a new WebContentsView
   * @param id Optional ID to use (otherwise auto-incremented)
   * @returns The ID of the created view
   */
  public createView(id?: number): number {
    const viewId = id || this.nextId++;
    const view = new CreateChildView(this.parentWindow, viewId);
    this.views.set(viewId, view);

    if (this.currentViewId === null) {
      this.selectView(viewId);
    } else {
      view.hide();
    }

    // Notify renderer process
    this.parentWindow.webContents.send('create-tab', viewId);

    return viewId;
  }

  /**
   * Select a WebContentsView to show
   * @param id The ID of the view to select
   */
  public selectView(id: number) {
    if (!this.views.has(id)) return;

    // Hide current view if one is selected
    if (this.currentViewId !== null) {
      const currentView = this.views.get(this.currentViewId);
      if (currentView) currentView.hide();
    }

    // Show new view
    const view = this.views.get(id);
    if (view) {
      view.show();
      this.currentViewId = id;
      
      // Notify renderer process
      this.parentWindow.webContents.send('tab-selected', id);
    }
  }

  /**
   * Close a WebContentsView
   * @param id The ID of the view to close
   */
  public closeView(id: number) {
    if (!this.views.has(id)) return;

    const view = this.views.get(id);
    if (view) {
      view.destroy();
      this.views.delete(id);

      // If we're closing the current view, select another one
      if (this.currentViewId === id) {
        this.currentViewId = null;
        if (this.views.size > 0) {
          const nextViewId = Array.from(this.views.keys())[0];
          this.selectView(nextViewId);
        } else {
          // Create a new tab if we're closing the last one
          this.createView();
        }
      }
    }
  }

  /**
   * Navigate a view to a URL
   * @param id The ID of the view
   * @param url The URL to navigate to
   */
  public navigateToUrl(id: number, url: string) {
    const view = this.views.get(id);
    if (view) {
      view.loadURL(url);
    }
  }

  /**
   * Go back in view history
   * @param id The ID of the view
   */
  public goBack(id: number) {
    const view = this.views.get(id);
    if (view) {
      view.goBack();
    }
  }

  /**
   * Go forward in view history
   * @param id The ID of the view
   */
  public goForward(id: number) {
    const view = this.views.get(id);
    if (view) {
      view.goForward();
    }
  }

  /**
   * Reload the view
   * @param id The ID of the view
   */
  public reload(id: number) {
    const view = this.views.get(id);
    if (view) {
      view.reload();
    }
  }

  /**
   * Get the current view ID
   */
  public getCurrentViewId(): number | null {
    return this.currentViewId;
  }

  /**
   * Destroy all views and clean up
   */
  public destroyAllViews() {
    this.views.forEach(view => view.destroy());
    this.views.clear();
    this.currentViewId = null;
  }
}