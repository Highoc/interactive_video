import React, { Component } from 'react';
import {Link, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';

import VideoCamera from '@material-ui/icons/Videocam';


const buttonContainer = {
  marginTop: '70px',
};

const styles = theme => ({
  root: {
    padding: '5px',
    float: 'right',
    width: '15%',
    height: '600px',
  },

});

class MenuRight extends Component {
  render() {
    const { classes, ...other } = this.props;
    const CreateVideo = props => <Link to="/channel/adminadmin00/create" {...props} />;
    const MyChannel = props => <Link to="/channel/adminadmin00" {...props} />;
    const Home = props => <Link to="/" {...props} />;

    return (
      <div className={classes.root}>
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
      </div>
    );
  }
}

MenuRight.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuRight);
