import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import VideoCamera from '@material-ui/icons/Videocam';
import HomeIcon from '@material-ui/icons/Home';
import Page from '@material-ui/icons/RestorePage';
import { Link } from 'react-router-dom';
import { RequestResolver } from '../../helpers/RequestResolver';
import ChannelList from '../ChannelList';

const drawerWidth = '90%';


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
    width: 0,
    [theme.breakpoints.up('sm')]: {
      width: 0,
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
    marginRight: '30%',
  },
});

const CreateVideo = props => <Link to="/channel/adminadmin00/create" {...props} />;
const MyChannel = props => <Link to="/channel/adminadmin00" {...props} />;
const Home = props => <Link to="/" {...props} />;

const mainListItems = (
  <div>
    <ListItem
      button
      component={MyChannel}
      key="button1"
    >
      <ListItemIcon><HomeIcon /></ListItemIcon>
      <ListItemText
        primary="My channel"
      />
    </ListItem>
    <Divider />
    <ListItem
      button
      component={Home}
      key="button2"
    >
      <ListItemIcon><Page /></ListItemIcon>
      <ListItemText
        primary="На главную"
      />
    </ListItem>
    <Divider />
    <ListItem
      button
      component={CreateVideo}
      key="button3"
    >
      <ListItemIcon><VideoCamera /></ListItemIcon>
      <ListItemText
        primary="Create Video"
      />
    </ListItem>
  </div>
);


class MenuLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('channel/list/');
      this.setState({ channels: result.data });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { classes, openDrawer } = this.props;
    const { channels } = this.state;


    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !openDrawer && classes.drawerPaperClose),
          }}
          open={openDrawer}
        >
          <List disablePadding>
            {mainListItems}
            <Divider />
            <div className={classes.Header}>
              <Typography variant="h6" align="left">
                Каналы
              </Typography>
            </div>

            <React.Fragment key="Subscriptions">
              {channels.map(({ name, key }) => (
                <ChannelList name={name} keyChannel={key} key={key} />
              ))}
              <Divider className={classes.divider} />
            </React.Fragment>
          </List>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  openDrawer: state.buttonsAct.openDrawer,
});


MenuLeft.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(MenuLeft));
