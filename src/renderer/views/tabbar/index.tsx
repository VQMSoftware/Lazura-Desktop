import React, { useState, useEffect } from 'react';
import {
  TabbarContainer,
  TabItem,
  TabFaviconWrapper,
  TabFavicon,
  Spinner,
  TabTitle,
  TabCloseButton,
  AddTabButton,
} from './style';

import addIcon from '@icons/add.svg';
import closeIcon from '@icons/close.svg';
import defaultFavicon from '@icons/defaultfavicon.svg';

interface Tab {
  id: number;
  title: string;
  favicon: string;
}

const Tabbar: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const [closingTabs, setClosingTabs] = useState<Set<number>>(new Set());
  const [loadingFavicons, setLoadingFavicons] = useState<Record<number, boolean>>({});

  const createTab = () => {
    const id = nextId;
    const newTab: Tab = { id, title: 'New Tab', favicon: '' };
    setTabs((prev) => [...prev, newTab]);
    setSelectedId(id);
    setNextId(id + 1);
    setLoadingFavicons((prev) => ({ ...prev, [id]: true }));
    window.electron?.send('create-web-contents-view', id);
    window.electron?.send('select-web-contents-view', id);
  };

  const selectTab = (id: number) => {
    setSelectedId(id);
    window.electron?.send('select-web-contents-view', id);
  };

  const closeTab = (id: number) => {
    setClosingTabs((prev) => new Set(prev).add(id));

    setTimeout(() => {
      setTabs((prevTabs) => {
        const index = prevTabs.findIndex((t) => t.id === id);
        if (index === -1) return prevTabs;

        const newTabs = prevTabs.filter((t) => t.id !== id);
        window.electron?.send('close-web-contents-view', id);

        if (selectedId === id) {
          if (newTabs.length === 0) {
            window.close();
          } else {
            const newSelectedIndex = index >= newTabs.length ? newTabs.length - 1 : index;
            setSelectedId(newTabs[newSelectedIndex].id);
            window.electron?.send('select-web-contents-view', newTabs[newSelectedIndex].id);
          }
        }

        return newTabs;
      });

      setClosingTabs((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }, 200);
  };

  useEffect(() => {
    const handleTabUpdate = (update: any) => {
      if (update.favicon) {
        // Delay to simulate loading
        setLoadingFavicons((prev) => ({ ...prev, [update.id]: true }));
        setTimeout(() => {
          setTabs((prevTabs) =>
            prevTabs.map((tab) =>
              tab.id === update.id
                ? {
                    ...tab,
                    title: update.title ?? tab.title,
                    favicon: update.favicon,
                  }
                : tab
            )
          );
        }, 600); // Simulate load time
      } else {
        // If no favicon provided, use fallback
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.id === update.id
              ? {
                  ...tab,
                  title: update.title ?? tab.title,
                  favicon: defaultFavicon,
                }
              : tab
          )
        );
      }

      setTimeout(() => {
        setLoadingFavicons((prev) => ({ ...prev, [update.id]: false }));
      }, 1000);
    };

    window.electron?.on?.('tab-update', handleTabUpdate);

    return () => {
      window.electron?.off?.('tab-update', handleTabUpdate);
    };
  }, []);

  useEffect(() => {
    if (tabs.length === 0) createTab();
  }, []);

  return (
    <TabbarContainer>
      {tabs.map(({ id, title, favicon }) => {
        const isLoading = loadingFavicons[id];

        return (
          <TabItem
            key={id}
            selected={id === selectedId}
            isClosing={closingTabs.has(id)}
            onClick={() => selectTab(id)}
            onMouseDown={(e) => e.button === 0 && selectTab(id)}
            role="tab"
            aria-selected={id === selectedId}
          >
            <TabFaviconWrapper>
              {isLoading ? <Spinner /> : <TabFavicon src={favicon || defaultFavicon} alt="favicon" onError={(e) => (e.currentTarget.src = defaultFavicon)} />}
            </TabFaviconWrapper>
            <TabTitle>{title}</TabTitle>
            <TabCloseButton
              src={closeIcon}
              alt="Close tab"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </TabItem>
        );
      })}

      <AddTabButton
        style={{ backgroundImage: `url(${addIcon})` }}
        onClick={createTab}
        aria-label="Add Tab"
        role="button"
      />
    </TabbarContainer>
  );
};

export default Tabbar;
