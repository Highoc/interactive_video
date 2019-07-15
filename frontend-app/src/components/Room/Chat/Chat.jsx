import React, { Component } from 'react';
import {
  withStyles, List, ListItem, ListItemText, ListItemAvatar, Avatar,
} from '@material-ui/core';
import clone from 'clone';
import PropTypes from 'prop-types';
import styles from './styles';
import picturePatch from '../../../static/images/channelPatch.png';
import Input from '../../Inputs/Input';
import { time } from '../../../helpers/Date/date';


class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageList: props.messageList,
      message: {
        owner: 'admin',
        text: '',
        time: 0,
        avatar: picturePatch,
      },
    };
  }

  onInputStateChange(data) {
    const { message } = this.state;
    message.text = data.value;
  }

  handleKeyPress(event) {
    const { message, messageList } = this.state;
    if (event.key === 'Enter' && message.text.trim() !== '') {
      message.time = time(Date.now());
      this.setState({ messageList: [...messageList, clone(message)] });
      message.text = '';
      this.setState({ message });
    }
  }

  render() {
    const { classes } = this.props;
    const { messageList, message } = this.state;
    return (
      <div className={classes.root}>
        <List className={classes.chatField}>
          {
            messageList.map((item, i) => (
              <ListItem alignItems="flex-start" key={i}>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={item.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${item.owner}   ${item.time}`}
                  secondary={(
                    <React.Fragment>
                      { item.text }
                    </React.Fragment>
)}
                />
              </ListItem>
            ))
          }
        </List>
        <div className={classes.textField} onKeyPress={this.handleKeyPress.bind(this)}>
          <Input
            type="textarea"
            label="text here"
            name="textarea"
            description="hello"
            rules={{ }}
            onStateChange={data => this.onInputStateChange(data)}
            value={message.text}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Chat);

Chat.propTypes = {
  messageList: PropTypes.object.isRequired,
};