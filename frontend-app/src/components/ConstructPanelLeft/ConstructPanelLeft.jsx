import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import SourceList from '../SourceList';
import DropBox from '../Drop/index';
import { uploadFile } from '../../actions/buttonActions';
import { RequestResolver } from '../../helpers/RequestResolver';

const drawerWidth = '80%';

const styles = theme => ({
  root: {
    padding: '5px',
    float: 'left',
    width: '15%',
  },
  drop: {
    marginLeft: '40%',
    marginRight: '20%',
  },
  categoryHeader: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  menuButtonHidden: {
    display: 'none',
  },
  textDense: {},

  card: {
    width: '100%',
  },
  media: {
    height: 120,
  },
  content: {
    height: '80%',
    width: '90%',
  },
});

class ConstructPanelLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: [],
      open: true,
      dialogOpen: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('video/source/list/');
      this.setState({ sources: result.data });
    } catch (error) {
      console.log(error);
    }
  }

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleAdd = () => {
    this.setState({ dialogOpen: true });
  };

  submitHandler() {
    this.setState({ dialogOpen: false });
  }

  callbackFiles(files) {
    const { sources } = this.state;
    sources.push(files);
    this.props.onFileUpload(files);
    this.setState({ sources });
  }

  render() {
    const { classes } = this.props;
    const { sources, dialogOpen } = this.state;

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <Typography variant="h6">
              Фрагменты
            </Typography>
          </div>
          <Divider className={classes.divider} />
          {sources.map((video, i) => (
            <SourceList name={video[0].name} keyVideo={i} key={i} />
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
        </Drawer>
        <Dialog
          onClose={this.handleClose}
          open={dialogOpen}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle onClose={this.handleClose}>
            Добавление фрагмента
          </DialogTitle>
          <div className={classes.drop}>
            <DropBox callback={droppedFiles => this.callbackFiles(droppedFiles)} />
          </div>
          <DialogActions>
            <Button onClick={(event) => { event.preventDefault(); this.submitHandler(); }} color="primary">
             Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ConstructPanelLeft.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  isAuthorized: state.authorization.token !== null,
});

const mapDispatchToProps = dispatch => ({
  onFileUpload: files => dispatch(uploadFile(files)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(ConstructPanelLeft)));
