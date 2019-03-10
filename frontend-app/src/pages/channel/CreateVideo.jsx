import React, { Component } from 'react';
import 'react-tree-graph/dist/style.css';
import Tree from 'react-tree-graph';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

const styles = {
  customContainer: {
    backgroundColor: '#444',
    position: 'relative',
    paddingBottom: '56.25%',
    height: '0',
    overflow: 'hidden',
  },
  custom: {
    stroke: '#2593B8',
    strokeWidth: '1.5px',
    fontSize: '20px',
    textShadow: '0 1px 4px black',
    cursor: 'pointer',
  },
};

const data = {
  name: 'Video0',
  children: [{
    name: 'Video1',
  }, {
    name: 'Video2',
    gProps: {
      onClick: (event, node) => alert(`Clicked ${node}!`),
    },
  }],
};

class CreateVideo extends Component {
  render() {
    const { classes, match } = this.props;
    return (
      <div>
        <div>
          Я создаю видео на канале
          {' '}
          {match.params.ch_id}
          !
        </div>
        <div className={classes.customContainer}>
          <Tree
            data={data}
            height={700}
            width={600}
            animated
            svgProps={{
              className: classes.custom,
            }}
          />
        </div>
      </div>
    );
  }
}

CreateVideo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateVideo);
