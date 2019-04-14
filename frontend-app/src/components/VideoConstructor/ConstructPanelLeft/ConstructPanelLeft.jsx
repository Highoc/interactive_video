import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import {
  Divider, Drawer, Card, CardActionArea, CardContent, CardMedia, Typography, withStyles,
} from '@material-ui/core';


import SourceList from '../SourceItem';
import { Dialog } from '../../Dialog';
import { ServerForm } from '../../Forms';

import { uploadFile } from '../../../store/actions/buttonActions';

import { RequestResolver } from '../../../helpers/RequestResolver';
import { perror, pprint } from '../../../helpers/SmartPrint';

import styles from './ConstructPanelLeft.styles';


class ConstructPanelLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: props.sources,
      inputs: [],
      dialogOpen: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('video/source/upload/');
      pprint('CreateVIdeo', result.data);
      this.setState({ inputs: result.data });
    } catch (error) {
      perror('ConstructPanelLeft', error);
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { sources: oldSources } = this.props;
    const { sources } = nextProps;
    if (sources !== oldSources) {
      this.setState({ sources });
    }
  }

  onDialogOpen(event) {
    event.preventDefault();
    this.setState({ dialogOpen: true });
  }

  onDialogClose() {
    this.setState({ dialogOpen: false });
  }

  onSubmitSuccess(data) {
    const { onFileUpload } = this.props;
    onFileUpload(data);
    this.setState({ dialogOpen: false });
  }

  render() {
    const { classes } = this.props;
    const { sources, dialogOpen, inputs } = this.state;

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          open
        >
          <Typography variant="h6" className={classes.title}>
            Фрагменты
          </Typography>
          <Divider className={classes.divider} />
          {sources.map(video => (
            <SourceList video={video} key={video.key} />
          ))}
          <Divider className={classes.divider} />
          <Card className={classes.card}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                title="Добавить видео"
                image="https://get.wallhere.com/photo/red-cross-cross-red-hospital-1231489.jpg"
                onClick={event => this.onDialogOpen(event)}
              />
              <CardContent className={classes.content}>
                <Typography gutterBottom variant="h6" component="h2" align="center">
                  Добавить видео
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Dialog title="Загрузите фрагмент видео" open={dialogOpen} onClose={() => this.onDialogClose()}>
            <ServerForm
              name="source-upload"
              inputs={inputs}
              action="/video/source/upload/"
              enctype="multipart/form-data"
              onSubmitSuccess={(data => this.onSubmitSuccess(data))}
            />
          </Dialog>
        </Drawer>
      </div>
    );
  }
}

ConstructPanelLeft.propTypes = {
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
      preview_url: PropTypes.string,
      content_url: PropTypes.string,
    }),
  ).isRequired,
  onFileUpload: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  sources: state.buttonsAct.filesUpload,
});

const mapDispatchToProps = dispatch => ({
  onFileUpload: files => dispatch(uploadFile(files)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ConstructPanelLeft));
