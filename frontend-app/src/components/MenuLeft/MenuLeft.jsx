import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';

import axios from 'axios';
import ChannelList from '../ChannelList';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import path from '../../Backend';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    padding: '5px',
    float: 'left',
    width: '15%',
    height: '600px',
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
});

class MenuLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      open: true,
    };
  }

  componentDidMount() {
    const url = `http://${path}/channel/list/`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ channels: result.data });
      },
    ).catch(error => console.log(error));
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { channels } = this.state;

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
          <Divider />
          <List disablePadding>
            <React.Fragment key="Subscriptions">
              <ListItem className={classes.categoryHeader}>
                <ListItemText
                  classes={{
                    primary: classes.categoryHeaderPrimary,
                  }}
                >
                  {'Subscriptions'}
                </ListItemText>
              </ListItem>
              {channels.map(({ name, key }) => (
                <ChannelList name={name} keyVideo={key} key={key} />
              ))}
              <Divider className={classes.divider} />
            </React.Fragment>
          </List>
        </Drawer>
      </div>
    );
  }
}

MenuLeft.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuLeft);
