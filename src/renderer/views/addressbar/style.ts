import styled from 'styled-components';

export const AddressBarContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  border-radius: 9999px;
  height: 32px;
  padding: 0 10px;
  flex: 1;
  min-width: 150px;
  transition: box-shadow 0.2s ease;

  &:focus-within {
    box-shadow: 0 0 0 2px #2684ff;
    background-color: #ffffff;
  }
`;

export const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 2px;
  margin-right: 6px;
  opacity: 0.6;
`;

export const Input = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
`;
