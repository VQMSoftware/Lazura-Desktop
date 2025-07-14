import styled from 'styled-components';

export const TitlebarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.titlebarBg || '#f5f5f5'};
  position: fixed;
  top: 0;
  left: 0;
  height: 34px;
  -webkit-app-region: drag; /* Drag the titlebar */
  z-index: 1000;
  user-select: none;
`;

export const WindowControlsContainer = styled.div`
  display: flex;
  margin-left: auto;
  height: 100%;
  -webkit-app-region: no-drag; /* Controls must be interactive */
`;

export const Line = styled.div`
  position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.12);
  width: 100%;
  height: 1px;
`;
