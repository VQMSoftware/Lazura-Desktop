import React from 'react';
import { Button, ButtonIcon, ButtonGroup } from './style';

import backIcon from '@icons/back.svg';
import forwardIcon from '@icons/forward.svg';
import refreshIcon from '@icons/refresh.svg';

const ToolbarButtons: React.FC = () => {
  return (
    <ButtonGroup>
      <Button>
        <ButtonIcon src={backIcon} alt="Back" />
      </Button>
      <Button>
        <ButtonIcon src={forwardIcon} alt="Forward" />
      </Button>
      <Button>
        <ButtonIcon src={refreshIcon} alt="Refresh" />
      </Button>
    </ButtonGroup>
  );
};

export default ToolbarButtons;
