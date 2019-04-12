import React, { Component } from 'react';
import {
  AppBar, Tab, Tabs,
} from '@material-ui/core';


import { RequestResolver } from '../../../helpers/RequestResolver';


class HomepageHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: props.channel,
      channelKey: props.channelKey,
      value: 0,
    };
    this.backend = RequestResolver.getBackend();
  }

  render() {
    const {
      value,
    } = this.state;

    return (
     <div>
       <AppBar position="static" color="primary">
         <Tabs
           value={value}
           onChange={this.handleChange}
           variant="fullWidth"
           indicatorColor="secondary"
           textColor="secondary"
           centered
         >
           <Tab label="Горячее" />
           <Tab label="Свежее" />
           <Tab label="Популярное" />
           <Tab label="Подписки" />
         </Tabs>
       </AppBar>
        {this.props.children}
     </div>
    );
  }
}


export default HomepageHead;
