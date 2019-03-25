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
  root: {
    padding: '5px',
    float: 'left',
    width: '15%',
    height: '600px',
  },
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
      keyVideo: props.keyVideo,
    };
  }


  render() {
    const { name, keyVideo } = this.state;
    const { classes } = this.props;
    const icon = <PermMediaOutlinedIcon />;
    const MyLink = props => <Link to={`/channel/${keyVideo}`} {...props} />;

    return (
      <ListItem
        button
        component={MyLink}
        key={`Video${keyVideo}`}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={name}
        >
        </ListItemText>
      </ListItem>
    );
  }
}

ChannelList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChannelList);
