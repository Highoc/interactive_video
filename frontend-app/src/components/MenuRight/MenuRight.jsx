import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
        <br />
        <Link to="/channel/1/watch/12deadbeef21"> Watch me 1 ! </Link>
        <br />
        <Link to="/channel/1/watch/21deadbeef12"> Watch me 2 ! </Link>
        <br />
        <Link to="/">Home</Link>
      </aside>
    );
  }
}
