import React from 'react';
import { ToolbarContainer, ToolbarContent } from './style';
import ToolbarButtons from '../toolbarbuttons';
import AddressBar from '../addressbar';
// TODO: implament browser extensions support --> import BrowserAction from '../BrowserAction';

const Toolbar: React.FC = () => {
  return (
    <ToolbarContainer>
      <ToolbarContent>
        <ToolbarButtons />
        <AddressBar />
        {/* <BrowserAction /> */}
      </ToolbarContent>
    </ToolbarContainer>
  );
};

export default Toolbar;
