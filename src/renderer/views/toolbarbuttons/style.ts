import styled from 'styled-components';

export const NavButtonGroup = styled.div`
  display: flex;
  gap: 6px;
`;

export const NavButton = styled.button`
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  padding: 0;
  margin: 0;
  box-sizing: border-box;

  &:hover {
    background-color: ${props => props.disabled ? 'transparent' : 'rgba(60, 60, 67, 0.1)'};
  }

  &:active {
    background-color: ${props => props.disabled ? 'transparent' : 'rgba(60, 60, 67, 0.2)'};
  }
`;

export const ButtonIcon = styled.img<{ $disabled?: boolean }>`
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  opacity: ${props => props.$disabled ? 0.4 : 1};
  display: block;
`;