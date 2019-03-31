import React, { Component } from 'react';
import { Search as SearchIcon } from '@material-ui/icons';
import {InputBase, withStyles} from '@material-ui/core';

import styles from './styles/SearchField.styles';

class SearchField extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.search}>
        <SearchIcon className={classes.searchIcon} />
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
            fullWidth: 'true',
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SearchField);
