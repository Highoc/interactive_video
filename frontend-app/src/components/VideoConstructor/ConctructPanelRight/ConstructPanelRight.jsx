import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';
import {
  Button, Drawer, Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import rightStyles from './ConstructPanelRight.styles';
import { buttonChoice } from '../../../store/actions/buttonActions';
import AddIcon from '@material-ui/icons/Add';

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
          <Typography variant="h6" align="center" color="textPrimary">
            Действия
          </Typography>
          <div className={classes.buttonContainer}>
            <Button color="secondary" variant="outlined" className={classes.button} size="large" onClick={() => onChoice(1)}>
              Добавить
              <AddIcon className={classes.rightIcon} />
            </Button>
          </div>
          <div className={classes.buttonContainer}>
            <Button color="secondary" variant="outlined" className={classes.button} size="large" onClick={() => onChoice(2)}>
              Удалить
              <DeleteIcon className={classes.rightIcon} />
            </Button>
          </div>
          <div className={classes.buttonContainer} />
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
