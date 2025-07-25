import styled, { css, keyframes } from 'styled-components';

// smooth enter animation.
const tabEnter = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// smooth exit animation.
const tabExit = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    opacity: 0;
  }
`;

// spin animation for loading indicators.
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const TabbarContainer = styled.div`
  display: flex;
  flex-grow: 1;
  height: 34px;
  position: relative;
  z-index: 1010;
  padding: 4px 0 0 8px;
  min-width: 0;
  overflow: visible;
  white-space: nowrap;
  max-width: calc(100% - 195px);
`;

interface TabItemProps {
  selected?: boolean;
  isClosing?: boolean;
}

export const TabItem = styled.div<TabItemProps>`
  display: flex;
  flex-grow: 1;
  align-items: center;
  max-width: 230px;
  min-width: 0;
  padding: 0 8px;
  overflow: hidden;
  height: 100%;
  font-size: 12px;
  user-select: none;
  background-color: ${({ selected }) => (selected ? 'white' : 'transparent')};
  border-top: ${({ selected }) => (selected ? '1px solid rgba(0,0,0,0.12)' : 'none')};
  border-left: ${({ selected }) => (selected ? '1px solid rgba(0,0,0,0.12)' : 'none')};
  border-right: ${({ selected }) => (selected ? '1px solid rgba(0,0,0,0.12)' : 'none')};
  border-bottom: none;
  position: relative;
  z-index: ${({ selected }) => (selected ? 1020 : 1010)};
  will-change: transform, opacity;
  animation: ${({ isClosing }) => (isClosing ? tabExit : tabEnter)}
    ${({ isClosing }) => (isClosing ? '200ms' : '300ms')} cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: forwards;

  ${({ isClosing }) =>
    isClosing &&
    css`
      pointer-events: none;
    `}

  ${({ selected }) =>
    !selected &&
    css`
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 10px 10px 0 0;
      }
    `}

  ${({ selected }) =>
    selected &&
    css`
      border-radius: 10px 10px 0 0;

      &::after {
        content: '';
        position: absolute;
        bottom: -22px;
        left: 0;
        right: 0;
        height: 22px;
        background-color: white;
        z-index: 1025;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    `}

  -webkit-app-region: no-drag;
`;

export const TabFaviconWrapper = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const TabFavicon = styled.img`
  width: 16px;
  height: 16px;
`;

export const Spinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid #ccc;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

export const TabTitle = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-grow: 1;
  min-width: 0;
`;

export const TabCloseButton = styled.img`
  height: 15px;
  width: 15px;
  margin-top: 2px;
  margin-left: 0px;
  margin-right: 0px;
  background-repeat: no-repeat;
  background-size: 13px;
  background-position: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  -webkit-app-region: no-drag;
`;

export const AddTabButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 0;
  height: 26px;
  margin-top: 6px;
  margin-left: 4px;
  width: 26px;
  background-repeat: no-repeat;
  background-size: 18px;
  background-position: center;
  opacity: 0.54;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  -webkit-app-region: no-drag;
`;
