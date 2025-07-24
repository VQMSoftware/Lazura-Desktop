import styled, { css } from 'styled-components';

export const AddressBarContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  border-radius: 9999px;
  height: 32px;
  padding: 0 10px;
  flex: 1;
  min-width: 120px;
  max-width: calc(100% - 70px); /* Prevents overlap with right toolbar */
  transition: box-shadow 0.2s ease;
  margin: 0 8px; /* Increased side margins */

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

export const InputWrapper = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
`;

export const OverlayText = styled.div<{ isFocused: boolean }>`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  pointer-events: none;
  user-select: none;
  transform: translateY(-50%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: inherit;
  padding-left: 2px;
  color: transparent;

  /* We will color the spans inside, override transparent on those */
  & .protocol {
    color: #adadadff;
  }
  & .domain {
    color: #323232ff;
  }
  & .rest {
    color: #adadadff;
  }

  /* Hide overlay text when input is focused so cursor is visible */
  ${(props) =>
    props.isFocused &&
    css`
      display: none;
    `}
`;

export const StyledInput = styled.input`
  position: relative;
  width: 100%;
  background: transparent;
  border: none;
  font-size: 14px;
  height: 32px;
  outline: none;
  color: #000000;
  padding-left: 2px;
  font-family: inherit;

  &:not(:focus) {
    color: transparent;
    /* Show cursor */
    caret-color: black;
  }
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
