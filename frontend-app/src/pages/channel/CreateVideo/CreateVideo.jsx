import React, { Component } from 'react';
import 'react-tree-graph/dist/style.css';
import Tree from 'react-d3-tree';
import clone from 'clone';
import {
  MenuItem, Select, DialogContent,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { RequestResolver, json } from '../../../helpers/RequestResolver';
import Input from '../../../components/Input/Input';
import Dialog from '../../../components/Dialog';
import { perror } from '../../../helpers/SmartPrint';
import classes from './CreateVideo.module.css';
import { activeSvgShape, deactiveSvgShape, NodeImage } from './CreateVideo.styles';

class CreateVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sources: props.files,
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
        },
        {
          type: 'text',
          name: 'Dialog',
          value: '',
          description: 'Ответ ведущий к этому фрагменту видео',
          rules: {
            max_length: 64,
            required: true,
          },
        },
      ],
    };
    this.backend = RequestResolver.getBackend();
    this.uploadVideo = this.uploadVideo.bind(this);
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('video/source/list/');
      this.setState({ sources: result.data });
    } catch (error) {
      perror('CreateVideo', error);
    }
  }

  handleOpen = () => {
    this.setState({ dialogOpen: true });
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

  async uploadVideo() {
    const { inputs } = this.state;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      try {
        const data = this.getVideoData();
        const result = await this.backend(json).post('video/upload/', data);
        this.setState({ videoKey: result.data.key });
      } catch (error) {
        this.setState({ videoKey: 'error' });
        perror('CreateVideo', error);
      }
    } else {
      console.log('Invalid input');
    }
  }

  callbackDialog(state) {
    this.setState({ dialogOpen: state });
    const { inputData, inputs } = this.state;
    inputData.text = inputs.find(elem => elem.name === 'Dialog').value;
    const { tree, nodeChosen } = this.state;
    const node = tree.findNodeByKey(nodeChosen);
    node.name = inputData.text;
    node.sourceKey = inputData.sourceKey;
    node.text = inputData.text;
    node.isReady = true;
    this.onUpdateTree();
  }

  onUpdateTree() {
    const { tree } = this.state;
    tree.tree = tree.getTreeData();
    this.setState({ tree });
  }

  handleButtonChoice(choice) {
    const { nodeChosen, tree } = this.state;

    if (choice === 1) {
      tree.addChildNode(nodeChosen);
      this.setState({ nodeChosen });
      this.onUpdateTree();
    }
    if (choice === 2) {
      tree.removeNode(nodeChosen);
      this.setState({ nodeChosen: null });
      this.onUpdateTree();
    }
    if (choice === 3) {
      this.uploadVideo();
    }
  }

  render() {
    const {
      tree, dialogOpen, inputData, inputs,
    } = this.state;
    const { files } = this.props;
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
      <div className={classes.container}>
        <h2>
Создание видео
          {this.state.videoKey}
        </h2>
        <div id="treeWrapper" style={{ width: '100%', height: '60%' }}>
          <Tree
            data={tree.tree}
            translate={{ x: 25, y: 350 }}
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
        <Dialog dialogOpen={dialogOpen} callback={state => this.callbackDialog(state)} title="Выберите фрагмент">
          <DialogContent>
            {Inputs[2]}
            <Select
              value={inputData.sourceKey}
              name="sourceKey"
              fullWidth
              onChange={this.handleChange}
            >
              { files.map((source, i) => (
                <MenuItem key={i} value={i}>{source.name}</MenuItem>
              ))}
            </Select>
          </DialogContent>
        </Dialog>
        {Inputs[0]}
        {Inputs[1]}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  files: state.buttonsAct.filesUpload,
});


export default connect(mapStateToProps)(CreateVideo);

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