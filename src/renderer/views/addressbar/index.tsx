import React, { useState, useEffect, useReducer, useRef } from 'react';
import {
  AddressBarContainer,
  InputWrapper,
  StyledInput,
  SearchIcon,
  OverlayText,
} from './style';
import searchIcon from '@icons/search.svg';

type UrlsState = Record<number, string>;
type ClearedState = Record<number, boolean>;

type Action =
  | { type: 'setUrl'; id: number; url: string }
  | { type: 'removeTab'; id: number };

type ClearAction =
  | { type: 'clear'; id: number }
  | { type: 'set'; id: number; cleared: boolean }
  | { type: 'remove'; id: number };

function urlsReducer(state: UrlsState, action: Action): UrlsState {
  switch (action.type) {
    case 'setUrl':
      return { ...state, [action.id]: action.url };
    case 'removeTab': {
      const { [action.id]: _, ...rest } = state;
      return rest;
    }
    default:
      return state;
  }
}

function clearedReducer(state: ClearedState, action: ClearAction): ClearedState {
  switch (action.type) {
    case 'clear':
      return { ...state, [action.id]: true };
    case 'set':
      return { ...state, [action.id]: action.cleared };
    case 'remove': {
      const { [action.id]: _, ...rest } = state;
      return rest;
    }
    default:
      return state;
  }
}

// Parse the URL into parts for coloring
function parseUrlParts(url: string) {
  // Example: https://website.com/path?query#hash
  // parts: protocol, domain, rest

  try {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol; // "https:"
    const host = urlObj.host; // domain + port (e.g. website.com)
    const pathname = urlObj.pathname; // "/path"
    const search = urlObj.search; // "?query"
    const hash = urlObj.hash; // "#hash"

    const protocolText = protocol + '//'; // e.g. "https://"
    const domainText = host; // e.g. "website.com"
    const restText = pathname + search + hash; // rest of URL

    return { protocolText, domainText, restText };
  } catch {
    // If invalid URL, fallback: show whole text as domain
    return { protocolText: '', domainText: url, restText: '' };
  }
}

const AddressBar: React.FC = () => {
  const [urls, dispatchUrls] = useReducer(urlsReducer, {});
  const [clearedTabs, dispatchCleared] = useReducer(clearedReducer, {});
  const urlsRef = useRef(urls);
  const clearedRef = useRef(clearedTabs);
  urlsRef.current = urls;
  clearedRef.current = clearedTabs;

  const [currentTabId, setCurrentTabId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const lastUrlRef = useRef<Record<number, string>>({});

  function refreshCurrentUrl() {
    if (!window.electron) return;
    const tabId = window.electron.getCurrentTabId?.();
    if (tabId === null || tabId === undefined) return;

    const url = window.electron.getTabUrlSync?.(tabId);
    if (!url) return;

    const lastKnown = lastUrlRef.current[tabId];

    if (url !== lastKnown) {
      lastUrlRef.current[tabId] = url;
      dispatchUrls({ type: 'setUrl', id: tabId, url });
      dispatchCleared({ type: 'set', id: tabId, cleared: false });

      if (tabId === currentTabId) {
        setInputValue(url);
      }
    }
  }

  useEffect(() => {
    const electron = window.electron;
    if (!electron) return;

    const updateUrl = (id: number, url: string) => {
      lastUrlRef.current[id] = url;
      dispatchUrls({ type: 'setUrl', id, url });
      dispatchCleared({ type: 'set', id, cleared: false });

      if (id === currentTabId) {
        setInputValue(url);
      }
    };

    const tabResolvedHandler = (_: any, { id, url }: { id: number; url: string }) => {
      if (url) updateUrl(id, url);
    };

    const tabUpdateHandler = (_: any, { id, url }: { id: number; url: string }) => {
      if (url) updateUrl(id, url);
    };

    const tabSelectedHandler = (_: any, id: number) => {
      setCurrentTabId(id);
      const url = urlsRef.current[id] || '';
      const wasCleared = clearedRef.current[id];
      if (!wasCleared) setInputValue(url);
    };

    const initialTabId = electron.getCurrentTabId?.();
    if (initialTabId !== null && initialTabId !== undefined) {
      setCurrentTabId(initialTabId);
      const initialUrl = urlsRef.current[initialTabId] || '';
      lastUrlRef.current[initialTabId] = initialUrl;
      setInputValue(initialUrl);
    }

    electron.on?.('tab-url-resolved', tabResolvedHandler);
    electron.on?.('tab-selected', tabSelectedHandler);
    electron.on?.('tab-update', tabUpdateHandler);

    const intervalId = setInterval(refreshCurrentUrl, 50); // ← interval for addressbar updates

    return () => {
      electron.off?.('tab-url-resolved', tabResolvedHandler);
      electron.off?.('tab-selected', tabSelectedHandler);
      electron.off?.('tab-update', tabUpdateHandler);
      clearInterval(intervalId);
    };
  }, [currentTabId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTabId === null || !window.electron) return;

    const trimmed = inputValue.trim();
    if (trimmed) {
      window.electron.send('navigate-to-url', {
        id: currentTabId,
        url: trimmed,
      });
      dispatchCleared({ type: 'set', id: currentTabId, cleared: false });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (currentTabId === null) return;

    dispatchUrls({ type: 'setUrl', id: currentTabId, url: val });
    dispatchCleared({
      type: 'set',
      id: currentTabId,
      cleared: val === '',
    });
  };

  // Prepare colored URL parts for overlay display
  const { protocolText, domainText, restText } = parseUrlParts(inputValue);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexGrow: 1 }}>
      <AddressBarContainer>
        <SearchIcon src={searchIcon} alt="Search" />
        <InputWrapper>
          <OverlayText
            isFocused={isFocused}
            aria-hidden="true"
          >
            <span className="protocol">{protocolText}</span>
            <span className="domain">{domainText}</span>
            <span className="rest">{restText}</span>
          </OverlayText>
          <StyledInput
            placeholder="Search or enter address"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              if (currentTabId !== null) {
                const wasCleared = clearedRef.current[currentTabId];
                if (!wasCleared) {
                  const realUrl = urlsRef.current[currentTabId] || '';
                  setInputValue(realUrl);
                }
              }
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </InputWrapper>
      </AddressBarContainer>
    </form>
  );
};

export default AddressBar;
