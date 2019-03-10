import React, { Component } from 'react';

export class Main extends Component {
  render() {
    const styles = {
      padding: '5px',
      width: '65%',
      maxWidth: 1203,
      height: '600px',
      margin: '1.5% 1.5% 0 1.5%',
      overflow: 'hidden',
    };

    const { children } = this.props;

    return (
      <main style={styles}>
        {children}
      </main>
    );
  }
}
