import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import VideoCamera from '@material-ui/icons/Videocam';
import Divider from "@material-ui/core/Divider";
import HomeIcon from '@material-ui/icons/Home';


const drawerWidth = 240;

const buttonContainer = {
  display: 'flex',
  marginTop: '70px',
  justifyContent: 'center',
  marginBottom: '5px',
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

class MenuRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }


  render() {
    const { classes, ...other } = this.props;
    const CreateVideo = props => <Link to="/channel/adminadmin00/create" {...props} />;
    const MyChannel = props => <Link to="/channel/adminadmin00" {...props} />;
    const Home = props => <Link to="/" {...props} />;


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
            <Button variant="contained" color="primary" className={classes.button} component={MyChannel}>
            My channel
              <HomeIcon fontSize="large" />
            </Button>
          </div>
          <div style={buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} component={CreateVideo}>
            Create Video
              <VideoCamera fontSize="large" />
            </Button>
          </div>

          <div style={buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} component={Home} size="large">
            На главную
            </Button>
          </div>
          <Divider />
        </Drawer>
      </div>
    );
  }
}

MenuRight.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuRight);
