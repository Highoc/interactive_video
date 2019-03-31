import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';
import {
  Drawer, Typography, List, Divider,
} from '@material-ui/core';

import { RequestResolver } from '../../../helpers/RequestResolver';
import ChannelList from '../../Channel/ChannelList';
import { perror } from '../../../helpers/SmartPrint';
import menuLeftStyles from './MenuLeft.styles';

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
      perror('MenuLeft', error);
    }
  }

  render() {
    const { classes } = this.props;
    const { channels } = this.state;
    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          open={true}
        >
          <List className={classes.list} disablePadding>
            <Typography variant="h6" align="center">
              Каналы
            </Typography>
            {channels.map(({ name, key }) => (
              <div key={`Channel${key}`}>
                <Divider key={`Devider${key}`} />
                <ChannelList name={name} keyChannel={key}  />
              </div>
            ))}
            <Divider />
          </List>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(menuLeftStyles)(MenuLeft);
