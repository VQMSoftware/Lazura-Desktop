import React from 'react';
import { ToolbarContainer, ToolbarContent } from './style';
import ToolbarButtons from '../toolbarbuttons';
import AddressBar from '../addressbar';

const Toolbar: React.FC = () => {
  return (
    <ToolbarContainer>
      <ToolbarContent>
        <ToolbarButtons />
        <AddressBar />
      </ToolbarContent>
    </ToolbarContainer>
  );
};

export default Toolbar;
