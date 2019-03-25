import React, { Component } from 'react';
import 'react-tree-graph/dist/style.css';

import Tree from 'react-d3-tree';
import axios from 'axios';

import clone from 'clone';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '../../components/Input/Input';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { backend as path } from '../../urls';



const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  container: {
    width: '65%',
    height: '700px',
  },
});


const activeSvgShape = {
  shape: 'circle',
  shapeProps: {
    r: 10,
    fill: 'green',
  },
  transitionDuration: 0,
};

const deactiveSvgShape = {
  shape: 'circle',
  shapeProps: {
    r: 10,
    fill: 'blue',
  },
  transitionDuration: 0,
};

class NodeImage extends Component {
  render() {
    const { nodeData } = this.props;
    return (
      <div>

        <div>
          {nodeData.name}
        </div>
      </div>
    );
  }
}

class CreateVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sources: [],
      tree: new TreeData(),
      nodeChosen: null,
      dialogOpen: false,
      uploadStatus: false,
      videoKey: '',
      inputData: {
        text: '',
        sourceKey: '',
      },
      isValid: false,
      inputs: [
        {
          type: 'text',
          name: 'name',
          value: '',
          description: 'Название видео',
          rules: {
            max_length: 64,
            required: true,
          },
        },
        {
          type: 'textarea',
          name: 'description',
          value: '',
          description: 'Описание видео',
          rules: {
            max_length: 4096,
            required: false,
          },
        }],
    };

    this.uploadVideo = this.uploadVideo.bind(this);
  }

  componentDidMount() {
    const url = `http://${path}/video/source/list/`;

    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ sources: result.data });
      },
    ).catch(error => console.log(error));
  }

  handleOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleClose = () => {
    const { inputData } = this.state;
    inputData.text = document.getElementById('text').value;
    console.log(inputData);
    const { tree, nodeChosen } = this.state;
    const node = tree.findNodeByKey(nodeChosen);
    console.log(nodeChosen);
    console.log(node);
    node.name = inputData.text;
    node.sourceKey = inputData.sourceKey;
    node.text = inputData.text;
    node.isReady = true;
    this.setState({ dialogOpen: false });
  };

  handleChange = (event) => {
    const { inputData } = this.state;
    inputData.sourceKey = event.target.value;
    this.setState({ inputData });
  };

  handleClick(key) {
    const { nodeChosen, tree } = this.state;
    if (nodeChosen === key) {
      this.handleOpen();
    } else {
      tree.activateNode(key);
      tree.deactivateNode(nodeChosen);
      this.setState({ nodeChosen: key });
    }
  }

  getVideoData() {
    return {
      name: this.state.inputs.find(elem => elem.name === 'name'),
      description: this.state.inputs.find(elem => elem.name === 'description'),
      main: this.getVideoPart(this.state.tree),
    };
  }

  getVideoPart(node) {
    const obj = {
      text: node.text,
      source_key: node.sourceKey,
    };

    if (node.children === undefined || node.children.length === 0) {
      return obj;
    }

    obj.children = [];
    for (const child of node.children) {
      obj.children.push(this.getVideoPart(child));
    }

    return obj;
  }

  callbackInput(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
    this.setState({ inputs });
  }

  uploadVideo(event) {
    const { inputs } = this.state;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      console.log('Отправить можно');
      axios.post(
        `http://${path}/video/upload/`, this.getVideoData(),
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
            'Content-Type': 'application/json',
          },
        },
      )
        .then((result) => {
          this.setState({ videoKey: result.data.key });
        })
        .catch((error) => {
          this.setState({ videoKey: 'error' });
        });
    } else {
      console.log('Invalid input');
    }
    event.preventDefault();
  }


  onUpdateTree() {
    const { tree } = this.state;
    tree.tree = tree.getTreeData();
    this.setState({ tree });
  }

  render() {
    const {
      sources, tree, dialogOpen, inputData, nodeChosen, inputs, isLoaded,
    } = this.state;
    const { classes } = this.props;
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
      <div styles={styles.container}>
        <div id="treeWrapper" style={{ width: '1000px', height: '500px' }}>

          <Tree
            data={tree.tree}
            translate={{ x: 20, y: 225 }}
            collapsible={false}
            zoomable={false}
            allowForeignObjects
            nodeSvgShape={deactiveSvgShape}
            nodeLabelComponent={{
              render: <NodeImage nodeData={tree} />,
              foreignObjectWrapper: {
                y: -25,
                x: -25,
              },
            }}
            onClick={(nodeData, event) => { this.handleClick(nodeData.key); this.onUpdateTree(); }}
          />

        </div>
        <Button variant="contained" color="primary" className={classes.button} onClick={() => { tree.addChildNode(nodeChosen); this.setState({ nodeChosen }); this.onUpdateTree() }}>
          Add Child
        </Button>
        <Button variant="contained" color="primary" className={classes.button} onClick={() => { tree.removeNode(nodeChosen); this.setState({ nodeChosen: null }); this.onUpdateTree() }}>
          Remove Child
        </Button>
        <Dialog
          onClose={this.handleClose}
          open={dialogOpen}
        >
          <DialogTitle onClose={this.handleClose}>
            Добавление фрагмента видео
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Введите ответ, ведущий к этому фрагменту видео:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="text"
              type="text"
              fullWidth
            />
            <Select
              value={inputData.sourceKey}
              name="sourceKey"
              fullWidth
              onChange={this.handleChange}
            >
              { sources.map(source => (
                <MenuItem
                  key={source.key}
                  value={source.key}
                >
                  {source.name}
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Спасти и сохранить
            </Button>
          </DialogActions>
        </Dialog>

        <h2>Создание видео {' '} {this.state.videoKey}</h2>
        {Inputs}

        <Fab
          variant="extended"
          color="primary"
          aria-label="Add"
          className={classes.margin}
          style={styles.button}
          onClick={event => this.uploadVideo(event)}
        >
          <NavigationIcon className={classes.extendedIcon} />
          Отправить
        </Fab>
      </div>
    );
  }
}

CreateVideo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateVideo);

class TreeData {
  constructor() {
    this.tree = {
      name: '',
      key: 0,
      children: [],
      isReady: false,
    };
    this.nodeCounter = 0;
  }

  getTreeData() {
    return clone(this.tree);
  }

  findNodeByKey(key, root = this.tree) {
    if (root.key === key) {
      return root;
    }

    if (root.children !== undefined) {
      for (const child of root.children) {
        const node = this.findNodeByKey(key, child);
        if (node !== null) {
          return node;
        }
      }
    }

    return null;
  }

  findParentNodeByKey(root, key) {
    if (root.children !== undefined) {
      for (const child of root.children) {
        if (child.key === key) {
          return root;
        }
        const node = this.findParentNodeByKey(child, key);
        if (node !== null) {
          return node;
        }
      }
    }

    return null;
  }

  activateNode(key) {
    if (key !== null) {
      const node = this.findNodeByKey(key);
      node.nodeSvgShape = activeSvgShape;
    }
  }

  deactivateNode(key) {
    if (key !== null) {
      const node = this.findNodeByKey(key);
      node.nodeSvgShape = deactiveSvgShape;
    }
  }

  addChildNode(key) {
    if (key === null) {
      return;
    }

    const node = this.findNodeByKey(key);

    const newNode = {
      name: '',
      key: this.generateKey(),
      children: [],
      isReady: false,
    };

    node.children.push(newNode);
  }

  generateKey() {
    this.nodeCounter += 1;
    return this.nodeCounter;
  }

  removeNode(key) {
    if (this.tree.key === key || key === null) {
      return;
    }

    const parentNode = this.findParentNodeByKey(this.tree, key);
    parentNode.children = parentNode.children.filter(child => child.key !== key);
  }
}
