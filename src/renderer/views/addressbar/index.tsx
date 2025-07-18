import React from 'react';
import { AddressBarContainer, Input, SearchIcon } from './style';
import searchIcon from '@icons/search.svg';

const AddressBar: React.FC = () => {
  return (
    <AddressBarContainer>
      <SearchIcon src={searchIcon} alt="Search" />
      <Input placeholder="Search or enter address" />
    </AddressBarContainer>
  );
};

export default AddressBar;
