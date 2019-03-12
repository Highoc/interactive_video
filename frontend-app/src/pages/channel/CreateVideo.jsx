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
};

const deactiveSvgShape = {
  shape: 'circle',
  shapeProps: {
    r: 10,
    fill: 'blue',
  },
};

class CreateVideo extends Component {
  nodeCounter = 0;

  constructor(props) {
    super(props);

    const myTreeData = {
      name: '',
      key: 0,
      isReady: false,
    };

    this.state = {
      sources: [],
      tree: myTreeData,
      nodeChosen: null,
      dialogOpen: false,
      inputData: {
        text: '',
        sourceKey: '',
      },
    };

    this.addChildNode = this.addChildNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
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
    this.setState({ dialogOpen: false });

    const { tree, nodeChosen } = this.state;
    const node = this.findNodeByKey(tree, nodeChosen);
    node.name = `${inputData.text}`;
    node.sourceKey = inputData.sourceKey;
    node.text = inputData.text;
    node.isReady = true;

    const newTree = clone(tree);
    this.setState({ tree: newTree });
  };

  addChildNode() {
    const { tree, nodeChosen } = this.state;

    if (nodeChosen === null) {
      return;
    }

    const node = this.findNodeByKey(tree, nodeChosen);

    const newNode = {
      name: '',
      key: this.generateKey(),
      isReady: false,
    };

    if (node.children !== undefined) {
      node.children.push(newNode);
    } else {
      node.children = [newNode];
    }

    const newTree = clone(tree);
    this.setState({ tree: newTree });
  }

  removeNode() {
    const { tree, nodeChosen } = this.state;
    if (tree.key === nodeChosen || nodeChosen === null) {
      return;
    }

    const parentNode = this.findParentNodeByKey(tree, nodeChosen);

    parentNode.children = parentNode.children.filter(child => child.key !== nodeChosen);

    const newTree = clone(tree);
    this.setState({ tree: newTree, nodeChosen: null });
  }

  handleChange = (event) => {
    const { inputData } = this.state;
    inputData.sourceKey = event.target.value;
    this.setState({ inputData });
  };

  handleClick(key) {
    const { nodeChosen } = this.state;
    if (nodeChosen === key) {
      this.handleOpen();
    } else {
      this.activateNode(key);
    }
  }

  activateNode(key) {
    const { tree, nodeChosen } = this.state;

    const newNode = this.findNodeByKey(tree, key);
    newNode.nodeSvgShape = activeSvgShape;

    if (nodeChosen !== null) {
      const oldNode = this.findNodeByKey(tree, nodeChosen);
      oldNode.nodeSvgShape = deactiveSvgShape;
    }

    const newTree = clone(tree);
    this.setState({ tree: newTree, nodeChosen: key });
  }

  findNodeByKey(root, key) {
    if (root.key === key) {
      return root;
    }

    if (root.children !== undefined) {
      for (const child of root.children) {
        const node = this.findNodeByKey(child, key);
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

  generateKey() {
    this.nodeCounter += 1;
    return this.nodeCounter;
  }

  render() {
    const { sources, tree, dialogOpen, selectOpen, inputData } = this.state;
    return (
      <div styles={styles}>
        <div id="treeWrapper" style={{ width: '1000px', height: '550px' }}>

          <Tree
            data={tree}
            translate={{ x: 20, y: 225 }}
            zoomable={false}
            nodeSvgShape={deactiveSvgShape}
            collapsible={false}
            onClick={(nodeData, event) => this.handleClick(nodeData.key)}
          />

        </div>
        <button onClick={this.addChildNode}>Add Child</button>
        <button onClick={this.removeNode}>Remove Node</button>
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
      </div>
    );
  }
}

export default CreateVideo;
