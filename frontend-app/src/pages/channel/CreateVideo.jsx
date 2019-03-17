import React, { Component } from 'react';
import 'react-tree-graph/dist/style.css';

import Tree from 'react-d3-tree';
import axios from "axios";

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

const styles = {
  width: '65%',
  height: '700px',
};

const activeSvgShape = {
  shape: 'circle',
  shapeProps: {
    r: 10,
    fill: 'green',
  },
  transitionDuration: 500,
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
    console.log(this.props);
    return (
      <div>
        <img src="https://www.fraud-magazine.com/uploadedImages/Fraud_Magazine/Content/Contact/joseph-dervaes-50x50.jpg" alt="error" />
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
      inputData: {
        text: '',
        sourceKey: '',
      },
      uploadStatus: false,
      videoKey: 'creating',
    };

    this.uploadVideo = this.uploadVideo.bind(this);
  }

  componentDidMount() {
    const url = 'http://192.168.1.205:8000/video/source/list/';

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
      name: document.getElementById('name').value,
      description: document.getElementById('description').value,
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

  uploadVideo() {
    axios.post(
      'http://192.168.1.205:8000/video/upload/', this.getVideoData(),
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
  }

  render() {
    const {
      sources, tree, dialogOpen, inputData, nodeChosen,
    } = this.state;
    return (
      <div styles={styles}>
        <div id="treeWrapper" style={{ width: '1000px', height: '500px' }}>

          <Tree
            data={tree.getTreeData()}
            translate={{ x: 20, y: 225 }}
            zoomable
            allowForeignObjects
            nodeSvgShape={deactiveSvgShape}
            nodeLabelComponent={{
              render: <NodeImage nodeData={tree} />,
              foreignObjectWrapper: {
                y: -25,
                x: -25,
              },
            }}
            collapsible={false}
            onClick={(nodeData, event) => this.handleClick(nodeData.key)}
          />

        </div>
        <button onClick={() => { tree.addChildNode(nodeChosen); this.setState({ nodeChosen }); }}>Add Child</button>
        <button onClick={() => { tree.removeNode(nodeChosen); this.setState({ nodeChosen: null }); }}>Remove Node</button>
        <span>
          {' '}
          {this.state.videoKey}
        </span>
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
        <TextField
          autoFocus
          label="Название видео"
          margin="dense"
          id="name"
          type="text"
          fullWidth
        />
        <TextField
          autoFocus
          label="Описание к видео"
          margin="dense"
          id="description"
          type="text"
          fullWidth
        />
        <button onClick={this.uploadVideo}>Сохранить</button>
      </div>
    );
  }
}


export default CreateVideo;


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
