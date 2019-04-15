import React, { Component } from 'react';
import PropTypes from 'prop-types';


import {
  Paper, Chip, Icon, withStyles,
} from '@material-ui/core';

import { AddCircle } from '@material-ui/icons';


import { Tag } from '.';

import styles from './styles';


class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: props.tags,
    };
  }

  onDelete(text) {
    const { tags } = this.state;

    //Запрос

    this.setState({
      tags: tags.filter(tag => tag.text !== text),
    });
  }

  onAdd(text) {
    const { tags } = this.state;

    //Запрос
    tags.push({ text });

    this.setState({ tags });
  }

  render() {
    const { editable, classes } = this.props;
    const { tags } = this.state;

    let addTag;
    if (editable) {
      addTag = (
        <Chip
          label="Добавить тег"
          color="secondary"
          variant="outlined"
          className={classes.chip}
          onDelete={() => this.onAdd('танос')}
          deleteIcon={<AddCircle color="secondary" />}
        />
      );
    }

    return (
      <Paper className={classes.root}>
        {
          tags.map(tag => (
            <Tag
              key={tag.text}
              text={tag.text}
              deletable={editable}
              onDelete={text => this.onDelete(text)}
            />
          ))
        }
        {addTag}
      </Paper>
    );
  }
}

export default withStyles(styles)(TagList);

TagList.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
    }),
  ).isRequired,
  editable: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};
