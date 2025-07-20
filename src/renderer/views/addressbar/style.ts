import styled from 'styled-components';

export const AddressBarContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  border-radius: 9999px;
  height: 32px;
  padding: 0 10px;
  flex: 1 1 auto;
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
  margin-left: 5px;
  margin-right: 6px;
  opacity: 0.6;
`;

export const Input = styled.input`
  flex: 1 1 auto;  /* grow and shrink */
  height: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  min-width: 0;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  margin-left: 3px;
  width: 16px;
  height: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;
