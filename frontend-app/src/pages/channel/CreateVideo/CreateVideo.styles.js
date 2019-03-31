import React, { Component } from "react";

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
    const { nodeData } = this.props;
    return (
      <div>
        <div>
          {nodeData.name}
        </div>
      </div>
    );
  }
}
