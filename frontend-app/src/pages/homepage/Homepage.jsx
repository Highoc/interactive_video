import React, { Component } from 'react';
import { RequestResolver } from '../../helpers/RequestResolver';
import { pprint, perror } from '../../helpers/SmartPrint';
import date from '../../helpers/Date/date';
import classes from './Homepage.module.css';
import { MovieList, ListHeader, HugeVideoPreview } from "../../components/Channel/ChannelInfo/presentations";
import HomepageHead from './HomepageHead/HomepageHead';

class Homepage extends Component {
  constructor(props) {
    super(props);

    const channelKey = 'adminadmin00';
    this.state = {
      channelKey,
      channel: null,
      isLoaded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    const channelKey = 'adminadmin00';
    try {
      const result = await this.backend().get(`channel/get/${channelKey}/`);
      this.setState({ isLoaded: true, channel: result.data });
      pprint('HomePage', result.data);
    } catch (error) {
      perror('HomePage', error);
    }
  }

  render() {
    const { isLoaded } = this.state;
    let result;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }
    /*
    * Создать / Изменить / Удалить канал
    * */
    const { channel, channelKey } = this.state;

    const testVideo = {
      name: 'Человек муравей уничтожает людей и муравьев',
      description: 'Самый маленький супергерой может победить все человечество или же нет? Как думаете? Я думаю, что\
        это невозможно, потому что он слишком маленький, чтобы всех победить, как говорится один в поле не воин, да и вообще земля плоская!!',
      channelName: 'Канал Супергероев',
      key: '12312412',
      created: date(channel.uploaded_playlist.video[0].created),
      preview_url: 'https://disima.ru/wp-content/uploads/2016/01/chelovek-muravej-art.jpg',
      rating: 500,
      views: 100500,
    };
    if (isLoaded) {
      result = (
        <div className={classes.root}>
          <ListHeader header="Тренды" />
          <MovieList movieList={channel.uploaded_playlist} channelKey={channelKey} />
          <HugeVideoPreview channelKey={channelKey} video={testVideo} />
        </div>
      );
    }
    else {
      result = <div> Еще не загружено </div>;
    }

    return (
      result
    );
  }
}

/*
*

* */

export default Homepage;
