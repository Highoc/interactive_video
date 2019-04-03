import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';
import {
  Button, Drawer,
} from '@material-ui/core';
import VideoCamera from '@material-ui/icons/Videocam';
import { connect } from 'react-redux';
import rightStyles from './ConstructPanelRight.styles';
import { buttonChoice } from '../../../store/actions/buttonActions';

export class ConstructPanelRight extends Component {
  render() {
    const { classes, onChoice } = this.props;

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          anchor="right"
          classes={{
            paperAnchorDockedRight: classNames(classes.drawerPaper),
          }}
          open
        >
          <div className={classes.buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} size="large" onClick={() => onChoice(1)}>
              Добавить узел
            </Button>
          </div>
          <div className={classes.buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} size="large" onClick={() => onChoice(2)}>
              Удалить узел
            </Button>
          </div>
          <div className={classes.buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} onClick={() => onChoice(3)}>
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

const mapStateToProps = state => ({
  choice: state.buttonsAct.buttonChoice,
});

const mapDispatchToProps = dispatch => ({
  onChoice: choice => dispatch(buttonChoice(choice)),
});


export default withStyles(rightStyles)(connect(mapStateToProps, mapDispatchToProps)(ConstructPanelRight));
