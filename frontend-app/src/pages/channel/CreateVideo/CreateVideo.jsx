import React, { Component } from 'react';
import 'react-tree-graph/dist/style.css';
import Tree from 'react-d3-tree';
import clone from 'clone';
import {
  MenuItem, Select, DialogContent, Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RequestResolver, json } from '../../../helpers/RequestResolver';
import Input from '../../../components/Input/Input';
import Dialog from '../../../components/Dialog';
import { perror, pprint } from '../../../helpers/SmartPrint';
import classes from './CreateVideo.module.css';
import { activeSvgShape, deactiveSvgShape, NodeImage } from './CreateVideo.styles';
import { buttonChoice, uploadFile } from '../../../store/actions/buttonActions';

class CreateVideo extends Component {
  constructor(props) {
    super(props);

    const { channelKey } = props.match.params;

    this.state = {
      sources: [],
      tree: new TreeData(),
      nodeChosen: null,
      dialogOpen: false,
      uploadStatus: false,
      channelKey,
      videoKey: '',
      inputData: {
        text: '',
        sourceKey: '',
      },
      isValid: false,
      isSent: false,
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
    const { onFileUpload } = this.props;
    try {
      const result = await this.backend().get('video/source/list/');
      pprint('CreateVIdeoSources', result.data);
      this.setState({ sources: result.data });
      result.data.map(source => onFileUpload(source));
    } catch (error) {
      perror('CreateVideo', error);
    }
  }

  handleOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleChange = (event) => {
    const { inputData, sources } = this.state;
    const keySource = sources[event.target.value].key;
    inputData.sourceKey = keySource;
    pprint('InputData', inputData);
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
      name: this.state.inputs.find(elem => elem.name === 'name').value,
      description: this.state.inputs.find(elem => elem.name === 'description').value,
      main: this.getVideoPart(this.state.tree.getTreeData()),
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
    pprint('tree', this.state.tree);
    pprint('obj', obj);
    return obj;
  }

  callbackInput(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
  }

  async uploadVideo() {
    const { inputsVideo } = this.state;
    let isValid = true;
    for (const key in inputsVideo) {
      isValid = isValid && inputsVideo[key].isValid;
    }

    if (isValid) {
      try {
        const data = this.getVideoData();
        pprint('CreateVIdeo', data);
        const result = await this.backend(json).post('video/upload/', data);
        this.setState({ videoKey: result.data.key, isSent: true });
      } catch (error) {
        this.setState({ videoKey: 'error' });
        perror('CreateVideo', error);
      }
    } else {
      console.log('Invalid input');
    }
  }

  callbackDialog() {
    this.setState({ dialogOpen: false });
    const { inputData, inputs } = this.state;
    inputData.text = inputs.find(elem => elem.name === 'Dialog').value;
    const { tree, nodeChosen } = this.state;
    const node = tree.findNodeByKey(nodeChosen);
    node.name = inputData.text;
    node.sourceKey = inputData.sourceKey;
    node.text = inputData.text;
    node.isReady = true;
    pprint('node', node);

    this.onUpdateTree();
  }

  onUpdateTree() {
    const { tree } = this.state;
    tree.tree = tree.getTreeData();
    this.setState({ tree });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.choice !== this.props.choice) {
      this.handleButtonChoice(this.props.choice);
    }
    if (prevProps.files !== this.props.files) {
      this.setState({ sources: this.props.files });
    }
  }

  handleButtonChoice(choice) {
    const { nodeChosen, tree } = this.state;
    const { onChoice } = this.props;
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
    onChoice(0);
  }

  render() {
    const {
      tree, dialogOpen, inputData, inputs, sources, isSent, channelKey, videoKey,
    } = this.state;

    if (isSent) {
      return <Redirect to={`/channel/${channelKey}/watch/${videoKey}`} />;
    }
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
        <Typography variant="title">
          Создание видео
          {this.state.videoKey}
        </Typography>
        <div id="treeWrapper" style={{ width: '100%', height: '60%' }}>
          <Tree
            data={tree.tree}
            translate={{ x: 25, y: 270 }}
            collapsible={false}
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
            onClick={(nodeData, event) => { this.handleClick(nodeData.key); this.onUpdateTree(); }}
          />
        </div>
        <Dialog dialogOpen={dialogOpen} callback={() => this.callbackDialog()} title="Выберите фрагмент">
          <DialogContent>
            {Inputs[2]}
            <Select
              value={inputData.sourceKey}
              name="sourceKey"
              fullWidth
              onChange={this.handleChange}
            >
              { sources.map((source, i) => (
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
  choice: state.buttonsAct.buttonChoice,
});

const mapDispatchToProps = dispatch => ({
  onFileUpload: files => dispatch(uploadFile(files)),
  onChoice: choice => dispatch(buttonChoice(choice)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateVideo);

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
