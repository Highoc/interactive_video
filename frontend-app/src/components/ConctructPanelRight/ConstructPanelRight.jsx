import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import VideoCamera from '@material-ui/icons/Videocam';

const drawerWidth = 240;

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
    height: '600px',
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
            <Button variant="contained" color="primary" className={classes.button} size="large">
              Добавить узел
            </Button>
          </div>
          <div style={buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} size="large">
              Удалить узел
            </Button>
          </div>
          <div style={buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button}>
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




