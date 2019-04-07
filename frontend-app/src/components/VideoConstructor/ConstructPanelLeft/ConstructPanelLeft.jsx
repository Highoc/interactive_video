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
import { Dialog } from '../../Dialog';
import { uploadFile } from '../../../store/actions/buttonActions';
import {multipart, RequestResolver} from '../../../helpers/RequestResolver';
import {perror, pprint} from '../../../helpers/SmartPrint';
import leftStyles from './ConstructPanelLeft.styles';
import Input from '../../Input/Input';

class ConstructPanelLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: [],
      dialogOpen: false,
      inputs: [],
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

  componentDidUpdate(prevProps) {
    if (prevProps.files !== this.props.files) {
      this.setState({ sources: this.props.files });
    }
  }

  handleAdd = () => {
    this.setState({ dialogOpen: true });
  };

  callbackInput(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
    if (state.file !== null) {
      input.value = state.file;
    }
    if (state.source !== null) {
      input.value = state.source;
    }
    this.setState({ inputs });
  }

  getData() {
    const { inputs } = this.state;
    const result = new FormData();
    inputs.map((input) => { result.append(input.name, input.value); return 0; });
    return result;
  }

  async callbackDialog(state) {
    const { inputs } = this.state;
    const { onFileUpload } = this.props;
    const filePush = [];
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }
    if (isValid) {
      try {
        const data = this.getData();
        const result = await this.backend(multipart).post('video/source/upload/', data);
        filePush[0] = result.data;
        filePush.map(source => onFileUpload(source));
        this.setState({ isSent: true, dialogOpen: state });
      } catch (error) {
        perror('ConstructPanelRIght', error);
      }
    } else {
      console.log('Invalid input');
    }
  }

  render() {
    const { classes } = this.props;
    const { sources, dialogOpen, inputs } = this.state;
    const Inputs = Object.keys(inputs).map((key) => {
      const inputElement = inputs[key];
      return (
        <Input
          key={key}
          type={inputElement.type}
          name={inputElement.name}
          description={inputElement.description}
          value={inputElement.value}
          rules={inputElement.rules}
          callback={state => this.callbackInput(state)}
        />
      );
    });

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
          {sources.map((video, key) => (
            <SourceList name={video.name} keyVideo={key} key={key} previewUrl={video.preview_url} />
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
          <Dialog dialogOpen={dialogOpen} callback={state => this.callbackDialog(state)} title="Загрузите видео">
            {Inputs}
          </Dialog>
        </Drawer>
      </div>
    );
  }
}

ConstructPanelLeft.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  files: state.buttonsAct.filesUpload,
});

const mapDispatchToProps = dispatch => ({
  onFileUpload: files => dispatch(uploadFile(files)),
});

export default withStyles(leftStyles)(connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(ConstructPanelLeft)));
