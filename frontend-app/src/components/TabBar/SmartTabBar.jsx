import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  AppBar, Tabs, Tab, withStyles,
} from '@material-ui/core';

import styles from './styles';

class SmartTabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
    };
  }

  onChange(value) {
    this.setState({ value });
  }

  render() {
    const { value } = this.state;
    const { tabs, classes } = this.props;

    const { container } = tabs.find(curr => curr.value === value);

    return (
      <AppBar position="static" color="primary">
        <Tabs
          value={value}
          onChange={(event, newValue) => this.onChange(newValue)}
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="secondary"
          centered
        >
          {
            tabs.map(tab => (
              <Tab
                key={tab.value}
                label={tab.label}
                icon={tab.icon}
                value={tab.value}
              />
            ))
          }
        </Tabs>
        <div className={classes.container}>
          {container}
        </div>
      </AppBar>
    );
  }
}

export default withStyles(styles)(SmartTabBar);

SmartTabBar.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
      icon: PropTypes.node,
      container: PropTypes.node,
    }),
  ).isRequired,
  classes: PropTypes.object.isRequired,
};
