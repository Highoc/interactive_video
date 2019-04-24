import React, { Component } from 'react';

import classes from './Test.module.css';

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={classes.main_container}>
        <div className={classes.overlay} />
        <video className={classes.video} width="" height="" controls="controls" loop="loop" autoPlay="">
          <source src="https://hb.bizmrg.com/interactive_video/public_test/part1_dashinit.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
}

export default Test;
