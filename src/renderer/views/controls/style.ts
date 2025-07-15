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
  background-position: center center;
  background-size: 16px 16px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &.minimize {
    background-position: center 45%;
  }

  &.close {
    background-size: 21px 21px;
    background-position: center 58%;
  }

  &.close:hover {
    background-color: #e81123;
  }
`;
