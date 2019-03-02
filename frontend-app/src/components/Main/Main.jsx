import React, { Component } from 'react';

export class Main extends Component {
  render() {
    const styles = {
      color: '#FF8C00',
      backgroundColor: '#FF2D00',
      padding: '5px',
      width: '65%',
      height: '600px',
      margin: '1.5% 1.5% 0 1.5%',
      float: 'left',
    };

    const { children } = this.props;

    return (
      <main style={styles}>
        {children}
      </main>
    );
  }
}
