import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

export const activeSvgShape = {
  shape: 'circle',
  shapeProps: {
    r: 10,
    fill: 'green',
  },
  transitionDuration: 0,
};

export const deactiveSvgShape = {
  shape: 'circle',
  shapeProps: {
    r: 10,
    fill: 'blue',
  },
  transitionDuration: 0,
};

export class NodeImage extends Component {
  render() {
    const { nodeData, sources } = this.props;
    const source = sources.find(elem => elem.key === nodeData.sourceKey);
    let preview = '';
    let name = '';
    let answer = '';
    if (source) {
      preview = source.preview_url;
      name = source.name;
    }
    if (nodeData.name !== '') {
      answer = `Ответ, ведущий сюда: ${nodeData.name}`;
    }

    return (
      <div>
        <img src={preview} alt="" width="116px" height="116px" />
        <Typography variant="h3" color="textPrimary" align="center">
          {name}
        </Typography>
        <Typography variant="h3" color="textPrimary" align="center">
          { answer }
        </Typography>
      </div>
    );
  }
}
