import styled from 'styled-components';

export const ControlsContainer = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  height: 34px;
  align-items: center;
  -webkit-app-region: no-drag; /* buttons clickable */
`;

export const WindowButton = styled.div`
  width: 45px;
  height: 34px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &.close:hover {
    background-color: #e81123;
  }
`;
