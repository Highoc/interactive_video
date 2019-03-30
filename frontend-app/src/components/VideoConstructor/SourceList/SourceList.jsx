import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';
import Card from '@material-ui/core/Card/index';
import CardActionArea from '@material-ui/core/CardActionArea/index';
import CardMedia from '@material-ui/core/CardMedia/index';
import Button from '@material-ui/core/Button/index';
import CardActions from '@material-ui/core/CardActions/index';
import CardContent from '@material-ui/core/CardContent/index';
import Typography from '@material-ui/core/Typography/index';
import classes from './SourceList.module.css';

class SourceList extends Component {
  render() {
    const { name } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            title={name}
            image="https://image.freepik.com/free-icon/no-translate-detected_318-40191.jpg"
          />
          <CardContent className={classes.content}>
            <Typography gutterBottom variant="h6" component="h2" align="center">
              {name}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
                Изменить
            </Button>
          </CardActions>
        </CardActionArea>
      </Card>
    );
  }
}

SourceList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default SourceList;
