import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Input from '../Input/Input';
import SourceList from '../SourceList';
import { backend as path } from '../../urls';

const drawerWidth = 240;


const styles = theme => ({
  root: {
    padding: '5px',
    float: 'left',
    width: '15%',
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
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  menuButtonHidden: {
    display: 'none',
  },
  textDense: {},
  Header: {
    marginRight: '40px',
  },
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
      inputs: [
      ],
    };
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

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleAdd = () => {
    this.setState({ dialogOpen: true });
  };

  async submitHandler() {
    const { inputs } = this.state;
    let isValid = true;
    console.log(inputs);
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      console.log('Можно добавить');
      this.setState({ dialogOpen: false });
    } else {
      console.log('Invalid input');
    }
  }

  render() {
    const { classes } = this.props;
    const { sources, inputs, dialogOpen } = this.state;
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
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <div className={classes.Header}>
              <Typography variant="h6" align="left">
                Фрагменты
              </Typography>
            </div>
            <IconButton
              onClick={this.handleDrawerOpen}
              className={this.state.open && classes.menuButtonHidden}
            >
              <ChevronRightIcon />
            </IconButton>
            <IconButton onClick={this.handleDrawerClose} className={!this.state.open && classes.menuButtonHidden}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider className={classes.divider} />
          {sources.map(({ name, key }) => (
            <SourceList name={name} keyVideo={key} key={key} />
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
          <DialogContent>
            {Inputs}
          </DialogContent>
          <DialogActions>
            <Button onClick={(event) => { event.preventDefault(); this.submitHandler(); }} color="primary">
              Добавить фрагмент
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

export default withStyles(styles)(ConstructPanelLeft);
