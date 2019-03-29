import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';


const styles = theme => ({
  itemPrimary: {
    color: 'inherit',
    fontSize: 20,
    '&$textDense': {
      fontSize: 20,
    },
    fontFamily: 'Roboto',

  },
  textDense: {},
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
});


class ChannelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      keyChannel: props.keyChannel,
    };
  }


  render() {
    const { name, keyChannel } = this.state;
    const { classes } = this.props;
    const icon = <PermMediaOutlinedIcon />;
    const ChannelKey = props => <Link to={`/channel/${keyChannel}`} params={{ channelKey: keyChannel }} {...props} />;

    return (
      <ListItem
        button
        component={ChannelKey}
        key={keyChannel}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={name}
        />
      </ListItem>
    );
  }
}

ChannelList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChannelList);
