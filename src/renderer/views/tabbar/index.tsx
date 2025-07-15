import React, { useState, useEffect } from 'react';
import {
  TabbarContainer,
  TabItem,
  TabFavicon,
  TabTitle,
  TabCloseButton,
  AddTabButton,
} from './style';

import addIcon from '@icons/add.svg';
import closeIcon from '@icons/close.svg';

const GLOBE_FAVICON = `data:image/svg+xml;base64,PHN2ZyB...`; // Replace with real data URI

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

  const createTab = () => {
    const id = nextId;
    const newTab: Tab = { id, title: 'New Tab', favicon: GLOBE_FAVICON };
    setTabs((prev) => [...prev, newTab]);
    setSelectedId(id);
    setNextId(id + 1);
    window.electron?.send('create-web-contents-view', id);
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
    }, 200); // match exit animation duration
  };

  useEffect(() => {
    const handler = (id: number) => {
      setTabs((prev) => {
        if (prev.find((t) => t.id === id)) return prev;
        return [...prev, { id, title: 'New Tab', favicon: GLOBE_FAVICON }];
      });
      setSelectedId(id);
    };

    window.electron?.on?.('create-tab', handler);

    return () => {
      if (typeof window.electron?.off === 'function') {
        window.electron.off('create-tab', handler);
      }
    };
  }, []);

  useEffect(() => {
    if (tabs.length === 0) createTab();
  }, []);

  return (
    <TabbarContainer>
      {tabs.map(({ id, title, favicon }) => (
        <TabItem
          key={id}
          selected={id === selectedId}
          isClosing={closingTabs.has(id)}
          onClick={() => selectTab(id)}
          onMouseDown={(e) => e.button === 0 && selectTab(id)}
          role="tab"
          aria-selected={id === selectedId}
        >
          <TabFavicon src={favicon} alt="favicon" />
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
      ))}

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
