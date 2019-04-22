import React, { Component } from 'react';
import { Search as SearchIcon } from '@material-ui/icons';
import {InputBase, withStyles, Button, Toolbar, TextField} from '@material-ui/core';

import styles from './styles/SearchField.styles';

class SearchField extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { value } = this.state;
    const { onStateChange } = this.props;
    if (prevState.value !== value) {
      onStateChange(value);
    }
  }

  onChange(event) {
    const { value } = event.target;
    this.setState({ value });
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.search}>
        <SearchIcon className={classes.searchIcon} />
        <InputBase
          placeholder="Поиск…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
            fullWidth: 'true',
          }}
          onChange={event => this.onChange(event)}
          value={value}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SearchField);
