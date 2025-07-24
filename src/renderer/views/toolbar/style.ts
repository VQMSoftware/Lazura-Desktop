import styled from 'styled-components';

export const ToolbarContainer = styled.div`
  position: fixed;
  top: 40px;
  left: 0;
  width: 100%;
  height: 46px;
  background-color: white;
  z-index: 1001;
  border-bottom: 1.5px solid rgba(26, 26, 26, 0.2);
  pointer-events: auto;
  overflow: hidden; /* Prevent any overflow */
`;

export const ToolbarContent = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  gap: 8px;
  min-width: 0; /* Allow children to shrink */
`;
