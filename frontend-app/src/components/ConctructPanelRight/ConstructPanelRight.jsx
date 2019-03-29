import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import VideoCamera from '@material-ui/icons/Videocam';

const drawerWidth = '80%';

const buttonContainer = {
  display: 'flex',
  marginTop: '70px',
  justifyContent: 'center',
};

const styles = theme => ({
  root: {
    padding: '5px',
    float: 'right',
    width: '15%',
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
  drawerPaper: {
    position: 'relative',
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
    justifyContent: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  menuButtonHidden: {
    display: 'none',
  },

});

export class ConstructPanelRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  onReply(event, choice) {
    const { callback } = this.props;
    callback(choice);
    event.preventDefault();
  }

  render() {
    const { classes, ...other } = this.props;

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          anchor="right"
          classes={{
            paperAnchorDockedRight: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >

          <div style={buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} size="large" onClick={event => this.onReply(event, 1)}>
              Добавить узел
            </Button>
          </div>
          <div style={buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} size="large" onClick={event => this.onReply(event, 2)}>
              Удалить узел
            </Button>
          </div>
          <div style={buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} onClick={event => this.onReply(event, 3)}>
              Создать видео
              <VideoCamera fontSize="large" />
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

ConstructPanelRight.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(ConstructPanelRight);
