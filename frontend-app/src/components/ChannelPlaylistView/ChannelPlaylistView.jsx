import {Component} from "react";
import {Link} from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';



const styles = theme => ({
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, '
      + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  card: {
    width: '100%',
  },
  media: {
    height: 150,
  },
});

class ChannelPlaylistView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: props.playlist,
      channelKey: props.channelKey,
    };
  }

  render() {
    const { classes } = this.props;
    const {playlist, channelKey} = this.state;

    const MyLink = props => <Link to={`/channel/${channelKey}/playlist/${playlist.key}`} {...props} />;

    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            component={MyLink}
            className={classes.media}
            image={playlist.preview_url}
            title={playlist.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" align="center">
              Плейлист:
              {' '}
              {playlist.name}
            </Typography>
            <Typography component="p" align="center">
              {playlist.description}
            </Typography>
          </CardContent>
        </CardActionArea>

      </Card>
    );
  }
}

ChannelPlaylistView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChannelPlaylistView);

