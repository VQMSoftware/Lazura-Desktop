import React, { useState, useEffect, useRef } from 'react';
import { AddressBarContainer, Input, SearchIcon } from './style';
import searchIcon from '@icons/search.svg';

const AddressBar: React.FC = () => {
  const [urlMap, setUrlMap] = useState<Map<number, string>>(new Map());
  const [currentTabId, setCurrentTabId] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const listenerRef = useRef<((event: any, data: any) => void) | null>(null);

  const getCurrentUrl = () => {
    if (currentTabId === null) return '';
    return urlMap.get(currentTabId) || '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTabId !== null) {
      const inputUrl = getCurrentUrl().trim();
      if (inputUrl) {
        window.electron?.send('navigate-to-url', {
          id: currentTabId,
          url: inputUrl,
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    if (currentTabId !== null) {
      setUrlMap((prev) => {
        const updated = new Map(prev);
        updated.set(currentTabId, newUrl);
        return updated;
      });
    }
  };

  useEffect(() => {
    const initialTabId = window.electron?.getCurrentTabId();
    if (initialTabId !== null && initialTabId !== undefined) {
      setCurrentTabId(initialTabId);
    }

    const tabSelectedHandler = (_: any, id: number) => {
      setCurrentTabId(id);

      // Force update address bar from saved URL (for example after closing a tab)
      if (!isFocused) {
        const url = urlMap.get(id) || '';
        setUrlMap((prev) => {
          const updated = new Map(prev);
          updated.set(id, url); // forces rerender if needed
          return updated;
        });
      }
    };

    const tabUpdateHandler = (_event: any, { id, url: updatedUrl }: any) => {
      if (typeof updatedUrl === 'string') {
        setUrlMap((prev) => {
          const updated = new Map(prev);
          updated.set(id, updatedUrl);
          return updated;
        });

        if (!isFocused && id === currentTabId) {
          setTimeout(() => {
            if (currentTabId === id) {
              setUrlMap((prev) => {
                const updated = new Map(prev);
                updated.set(id, updatedUrl);
                return updated;
              });
            }
          }, 0);
        }
      }
    };

    const electron = window.electron;

    if (electron?.on) {
      electron.on('tab-selected', tabSelectedHandler);
      electron.on('tab-update', tabUpdateHandler);
    }

    return () => {
      if (electron?.off) {
        electron.off('tab-selected', tabSelectedHandler);
        electron.off('tab-update', tabUpdateHandler);
      }
    };
  }, [isFocused, currentTabId, urlMap]);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexGrow: 1 }}>
      <AddressBarContainer>
        <SearchIcon src={searchIcon} alt="Search" />
        <Input
          placeholder="Search or enter address"
          value={getCurrentUrl()}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          spellCheck={false}
          autoComplete="off"
        />
      </AddressBarContainer>
    </form>
  );
};

export default AddressBar;
