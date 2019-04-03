import React, { Component } from 'react';
import {
  Card, CardContent, CardMedia, CardActionArea, CardActions, Button, Typography,
} from '@material-ui/core';
import classes from './SourceList.module.css';

class SourceList extends Component {
  render() {
    const { name, previewUrl } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            title={name}
            image={previewUrl}
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

export default SourceList;
