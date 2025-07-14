import styled from 'styled-components';

export const TabbarContainer = styled.div`
  display: flex;
  flex-grow: 1;
  height: 34px;
  position: relative;
  z-index: 2;
  padding: 4px;
  padding-bottom: 0;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  max-width: calc(100% - 150px);
  /* No changes here */
`;

interface TabItemProps {
  selected?: boolean;
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
  border-bottom: ${({ selected }) => (selected ? 'none' : '1px solid transparent')};

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  -webkit-app-region: no-drag; /* <-- make tab interactive */
`;

export const TabFavicon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 4px;
  flex-shrink: 0;
  /* No changes */
`;

export const TabTitle = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-grow: 1;
  min-width: 0;
  /* No changes */
`;

export const TabCloseButton = styled.img`
  height: 14px;
  width: 14px;
  margin-left: 2px;
  margin-right: -2px;
  background-repeat: no-repeat;
  background-size: 11px; /* Subtle adjustment */
  background-position: center;
  cursor: pointer;

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
