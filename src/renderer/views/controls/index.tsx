import React from 'react';
import {
  ControlsContainer,
  WindowButton,
} from './style';

import minimizeIcon from '@icons/minimize.svg';
import maximizeIcon from '@icons/maximize.svg';
import closeIcon from '@icons/closewindow.svg';

const WindowControls: React.FC = () => {
  const send = (channel: string) => window.electron?.send(channel, {});

  return (
    <ControlsContainer>
      <WindowButton
        className="minimize"
        onClick={() => send('window-minimize')}
        style={{ backgroundImage: `url(${minimizeIcon})` }}
        aria-label="Minimize"
      />
      <WindowButton
        className="maximize"
        onClick={() => send('window-maximize')}
        style={{ backgroundImage: `url(${maximizeIcon})` }}
        aria-label="Maximize"
      />
      <WindowButton
        className="close"
        onClick={() => send('window-close')}
        style={{ backgroundImage: `url(${closeIcon})` }}
        aria-label="Close"
      />
    </ControlsContainer>
  );
};

export default WindowControls;
