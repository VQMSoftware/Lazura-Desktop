import styled from 'styled-components';

export const TitlebarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.titlebarBg || '#cfd8dc'}; /* Cool, slightly blue-gray like Chromium */
  position: fixed;
  top: 0;
  left: 0;
  height: 40px; /* Slightly taller */
  -webkit-app-region: drag;
  z-index: 1000; /* below Tabbar's z-index */
  user-select: none;
`;

export const WindowControlsContainer = styled.div`
  display: flex;
  margin-left: auto;
  height: 100%;
  -webkit-app-region: no-drag;
`;