import React, { useEffect, useState, useCallback } from 'react';
import { Button, ButtonIcon, ButtonGroup } from './style';

import backIcon from '@icons/back.svg';
import forwardIcon from '@icons/forward.svg';
import refreshIcon from '@icons/refresh.svg';

const ToolbarButtons: React.FC = () => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const updateNavigationState = useCallback(async () => {
    const currentTabId = window.electron?.getCurrentTabId?.();
    if (typeof currentTabId === 'number') {
      try {
        const state = await window.electron?.getNavigationState?.(currentTabId);
        if (state) {
          setCanGoBack(state.canGoBack ?? false);
          setCanGoForward(state.canGoForward ?? false);
        }
      } catch (err) {
        console.error('Failed to get navigation state:', err);
      }
    }
  }, []);

  useEffect(() => {
    const handleTabUpdate = (data: any) => {
      const currentTabId = window.electron?.getCurrentTabId?.();
      if (currentTabId && data.id === currentTabId) {
        if (typeof data.canGoBack === 'boolean') setCanGoBack(data.canGoBack);
        if (typeof data.canGoForward === 'boolean') setCanGoForward(data.canGoForward);
      }
    };

    const handleTabSelected = (tabId: number) => {
      updateNavigationState();
    };

    // Listen to tab updates
    const listenerA = window.electron?.on?.('tab-update', handleTabUpdate);
    const listenerB = window.electron?.on?.('tab-selected', handleTabSelected);

    // Immediately update when mounted
    updateNavigationState();

    return () => {
      if (listenerA) window.electron?.off?.('tab-update', listenerA);
      if (listenerB) window.electron?.off?.('tab-selected', listenerB);
    };
  }, [updateNavigationState]);

  const handleBack = () => {
    const currentTabId = window.electron?.getCurrentTabId();
    if (currentTabId && canGoBack) {
      window.electron?.send('go-back', currentTabId);
    }
  };

  const handleForward = () => {
    const currentTabId = window.electron?.getCurrentTabId();
    if (currentTabId && canGoForward) {
      window.electron?.send('go-forward', currentTabId);
    }
  };

  const handleRefresh = () => {
    const currentTabId = window.electron?.getCurrentTabId();
    if (currentTabId) {
      window.electron?.send('reload', currentTabId);
    }
  };

  return (
    <ButtonGroup>
      <Button onClick={handleBack} disabled={!canGoBack}>
        <ButtonIcon src={backIcon} alt="Back" $disabled={!canGoBack} />
      </Button>
      <Button onClick={handleForward} disabled={!canGoForward}>
        <ButtonIcon src={forwardIcon} alt="Forward" $disabled={!canGoForward} />
      </Button>
      <Button onClick={handleRefresh}>
        <ButtonIcon src={refreshIcon} alt="Refresh" />
      </Button>
    </ButtonGroup>
  );
};

export default ToolbarButtons;
