import React, { Component } from 'react';

export class MenuRight extends Component {
  render() {
    const styles = {
      color: '#FF8C00',
      backgroundColor: '#FF2D00',
      height: '600px',
      width: '15%',
      padding: '5px',
      margin: '1.5% 0 0 0',
      float: 'right',
    };

    return (
      <aside style={styles}>
                Правое меню!
      </aside>
    );
  }
}
