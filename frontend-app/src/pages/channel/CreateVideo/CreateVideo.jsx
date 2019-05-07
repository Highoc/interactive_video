import React, { Component } from 'react';
import 'react-tree-graph/dist/style.css';
import Tree from 'react-d3-tree';
import clone from 'clone';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  Typography, Button,
} from '@material-ui/core';


import { RequestResolver } from '../../../helpers/RequestResolver';
import { perror, pprint } from '../../../helpers/SmartPrint';

import classes from './CreateVideo.module.css';
import { activeSvgShape, deactiveSvgShape, NodeImage } from './CreateVideo.styles';
import { buttonChoice, uploadFile } from '../../../store/actions/buttonActions';

import { Dialog } from '../../../components/Dialog';
import { ServerForm } from '../../../components/Forms';
import { ChoiceInput, TextInput } from '../../../components/Inputs';

class CreateVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelKey: props.match.params,
      sources: [],
      tree: new TreeData(),
      nodeChosen: null,
      dialogOpen: false,
      videoKey: '',
      dialogData: {
        text: {
          value: '',
          isValid: false,
        },
        sourceKey: {
          value: '',
          isValid: false,
        },
      },
      isValid: false,
      isSent: false,
      isLoaded: false,
      inputs: [],
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    const { onFileUpload } = this.props;
    try {
      let result = await this.backend().get('video/source/list/');
      pprint('CreateVIdeoSources', result.data);
      this.setState({ sources: result.data });
      result.data.map(source => onFileUpload(source));
      result = await this.backend().get('video/upload/');
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      perror('CreateVideo', error);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.choice !== this.props.choice) {
      this.handleButtonChoice(this.props.choice);
    }
    if (prevProps.files !== this.props.files) {
      this.setState({ sources: this.props.files });
    }
  }

  handleOpen() {
    this.setState({ dialogOpen: true });
  }

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

  getData() {
    const result = [{
      name: 'main',
      value: this.getVideoPart(this.state.tree.getTreeData()),
    }];
    return result;
  }

  /*
* main: this.getVideoPart(this.state.tree.getTreeData()),
* */
  onUpdateTree() {
    const { tree } = this.state;
    tree.tree = tree.getTreeData();
    this.setState({ tree });
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
      // this.uploadVideo();
    }
    onChoice(0);
  }

  onSubmitSuccess(data) {
    this.setState({ isSent: true, videoKey: data.key });
  }

  onDialogClose() {
    this.setState({ dialogOpen: false });
  }

  onStateChange(state) {
    const { dialogData } = this.state;
    dialogData[state.name] = {
      value: state.value,
      isValid: state.isValid,
    };
    this.setState({ dialogData });
  }

  onButtonClick() {
    const { dialogData } = this.state;
    const { text, sourceKey } = dialogData;

    if (!text.isValid || !sourceKey.isValid) {
      return;
    }

    const { tree, nodeChosen } = this.state;
    const node = tree.findNodeByKey(nodeChosen);
    node.name = text.value;
    node.isReady = true;
    node.sourceKey = sourceKey.value;
    node.text = text.value;

    this.setState({
      dialogData: {
        text: {
          value: '',
          isValid: false,
        },
        sourceKey: {
          value: '',
          isValid: false,
        },
      },
    });

    this.onDialogClose();
    this.onUpdateTree();
  }

  render() {
    const {
      tree, inputs, sources, channelKey, videoKey, isSent, isLoaded, dialogOpen, dialogData,
    } = this.state;

    if (isSent) {
      return <Redirect to={`/channel/${channelKey}/watch/${videoKey}`} />;
    }

    if (!isLoaded) {
      return <div className={classes.root}>Загружается</div>;
    }

    return (
      <div className={classes.container}>
        <Typography variant="h6">
          Создание видео
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
              render: <NodeImage nodeData={tree} sources={sources} />,
              foreignObjectWrapper: {
                y: -50,
                x: -50,
              },
            }}
            separation={{
              siblings: 1.5,
              nonSiblings: 2,
            }}
            onClick={(nodeData, event) => { this.handleClick(nodeData.key); this.onUpdateTree(); }}
          />
        </div>
        <ServerForm
          action="video/upload/"
          enctype="multipart/form-data"
          name="video-upload"
          inputs={inputs}
          onSubmitSuccess={data => this.onSubmitSuccess(data)}
          getInputsDynamic={() => this.getData()}
        />
        <Dialog title="Выберите фрагмент" open={dialogOpen} onClose={() => this.onDialogClose()}>
          <ChoiceInput
            label="Фрагмент видео"
            name="sourceKey"
            value={dialogData.sourceKey.value}
            choices={sources.map(source => ({ value: source.key, text: source.name }))}
            onStateChange={data => this.onStateChange(data)}
            rules={{ required: true }}
          />
          <TextInput
            label="Ответ"
            name="text"
            value={dialogData.text.value}
            placeholder="Введите ответ, ведущий к этому фрагменту"
            onStateChange={data => this.onStateChange(data)}
            rules={{ required: true }}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => this.onButtonClick()}
          >
            Сохранить
          </Button>
        </Dialog>
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
