import styled from 'styled-components';

export const ToolbarContainer = styled.div`
  width: 100%;
  height: 46px;
  background-color: white;
  border-bottom: 1.5px solid rgba(0, 0, 0, 0.12);
  position: fixed;
  top: 40px;
  left: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
`;

export const ToolbarContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  width: 100%;
  gap: 12px;
`;
