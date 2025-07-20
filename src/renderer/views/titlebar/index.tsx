import React from 'react';
import { TitlebarContainer, WindowControlsContainer } from './style';
import Tabbar from '../tabbar';
import WindowControls from '../controls';

const Titlebar: React.FC = () => {
  return (
    <TitlebarContainer>
      <Tabbar />
      <WindowControlsContainer>
        <WindowControls />
      </WindowControlsContainer>
    </TitlebarContainer>
  );
};

export default Titlebar;
