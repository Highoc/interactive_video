import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend/lib/cjs/index';
import { DragDropContext } from 'react-dnd/lib/cjs/index';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';
import {
  Divider, Drawer, Card, CardActionArea, CardContent, CardMedia, Typography,
} from '@material-ui/core';

import { connect } from 'react-redux';
import SourceList from '../SourceList';
import Dialog from '../../Dialog';
import DropBox from '../../Drop';
import { uploadFile } from '../../../store/actions/buttonActions';
import { RequestResolver } from '../../../helpers/RequestResolver';
import { perror } from '../../../helpers/SmartPrint';
import leftStyles from './ConstructPanelLeft.styles';

class ConstructPanelLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: [],
      dialogOpen: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('video/source/list/');
      this.setState({ sources: result.data });
    } catch (error) {
      perror('ConstructPanelLeft', error);
    }
  }

  handleAdd = () => {
    this.setState({ dialogOpen: true });
  };

  callbackFiles(files) {
    const { sources } = this.state;
    sources.push(files[0]);
    this.props.onFileUpload(files[0]);
    this.setState({ sources });
  }

  callbackDialog(state) {
    this.setState({ dialogOpen: state });
  }

  render() {
    const { classes } = this.props;
    const { sources, dialogOpen } = this.state;

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          open={true}
        >
          <Typography variant="h6">
            Фрагменты
          </Typography>
          <Divider className={classes.divider} />
          {sources.map((video, i) => (
            <SourceList name={video.name} keyVideo={i} key={i} />
          ))}
          <Divider className={classes.divider} />
          <Card className={classes.card}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                title="Добавить видео"
                image="http://www.clipartbest.com/cliparts/xcg/LA8/xcgLA8a7i.jpg"
                onClick={(event) => { event.preventDefault(); this.handleAdd(); }}
              />
              <CardContent className={classes.content}>
                <Typography gutterBottom variant="h6" component="h2" align="center">
                  Добавить видео
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Dialog dialogOpen={dialogOpen} callback={state => this.callbackDialog(state)}>
            <DropBox callback={droppedFiles => this.callbackFiles(droppedFiles)} />
          </Dialog>
        </Drawer>
      </div>
    );
  }
}

ConstructPanelLeft.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onFileUpload: files => dispatch(uploadFile(files)),
});

export default withStyles(leftStyles)(connect(mapDispatchToProps)(DragDropContext(HTML5Backend)(ConstructPanelLeft)));
