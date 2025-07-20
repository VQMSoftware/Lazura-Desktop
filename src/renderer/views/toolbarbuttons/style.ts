import styled from 'styled-components';

export const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
`;

export const Button = styled.button`
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;

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
  opacity: ${props => props.$disabled ? 0.4 : 1};
`;
