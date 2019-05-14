import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import {
  Paper, Chip, withStyles, Button,
} from '@material-ui/core';

import { AddCircle } from '@material-ui/icons';

import { Dialog } from '../Dialog';
import { TextInput } from '../Inputs';

import { RequestResolver } from '../../helpers/RequestResolver';
import { perror } from '../../helpers/SmartPrint';

import styles from './styles';


class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: props.tags,
      dialogOpen: false,
      newTag: '',
      isValid: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async onDelete(event, text) {
    event.preventDefault();
    try {
      const { tags } = this.state;
      const { videoKey } = this.props;

      await this.backend().post(`tag/video/${videoKey}/delete/`, { text });

      this.setState({
        tags: tags.filter(tag => tag.text !== text),
      });
    } catch (error) {
      perror('TagList', error);
    }
  }

  async onAdd(text) {
    try {
      const { tags } = this.state;
      const { videoKey } = this.props;

      const responce = await this.backend().post(`tag/video/${videoKey}/add/`, { text });

      if (!tags.find(tag => tag.text === responce.data.text)) {
        tags.push({ text: responce.data.text });
      }

      this.setState({ tags });
    } catch (error) {
      perror('TagList', error);
    }
  }

  onDialogOpen() {
    this.setState({ dialogOpen: true });
  }

  onDialogClose() {
    this.setState({ dialogOpen: false });
  }

  onStateChange(state) {
    this.setState({ newTag: state.value, isValid: state.isValid });
  }

  onSubmit() {
    const { newTag } = this.state;
    this.onDialogClose();
    this.onAdd(newTag);
    this.setState({
      newTag: '',
      isValid: false,
    });
  }

  render() {
    const { editable, classes } = this.props;
    const {
      tags, dialogOpen, newTag, isValid,
    } = this.state;
    let addTag;
    if (editable) {
      addTag = (
        <Chip
          label="Добавить тег"
          color="secondary"
          variant="outlined"
          className={classes.chip}
          onClick={() => this.onDialogOpen()}
          deleteIcon={<AddCircle color="secondary" />}
        />
      );
    }

    return (
      <div>
        <Paper className={classes.root}>
          {
            tags.map((tag) => {
              const TagLink = props => <Link to={`/search/?tag=${tag.text}`} {...props} />;

              let editProps;
              if (editable) {
                editProps = { onDelete: event => this.onDelete(event, tag.text) };
              }

              return (
                <Chip
                  label={`#${tag.text}`}
                  component={TagLink}
                  {...editProps}
                  clickable
                  color="secondary"
                  variant="outlined"
                  className={classes.chip}
                  key={`#${tag.text}`}
                />
              );
            })
          }
          {addTag}
        </Paper>
        <Dialog title="Добавление тега" open={dialogOpen} onClose={() => this.onDialogClose()}>
          <TextInput
            name="tag"
            value={newTag}
            label="Тег"
            placeholder="Введите название тега..."
            rules={{
              max_length: 16,
              required: true,
            }}
            onStateChange={state => this.onStateChange(state)}
          />
          <Button onClick={() => this.onSubmit()} color="primary" disabled={!isValid}>
            Отправить
          </Button>
        </Dialog>
      </div>
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
  videoKey: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};
