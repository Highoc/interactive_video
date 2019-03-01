import React, { Component } from 'react';

export class Header extends Component {
  render() {
    const styles = {
      color: '#FF8C00',
      backgroundColor: '#FF2D00',
      height: '70px',
      padding: '5px',
    };

    return (
      <header style={styles}>
                Хедер!
      </header>
    );
  }
}
