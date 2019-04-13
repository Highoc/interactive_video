import React, { Component } from 'react';
import { RequestResolver } from '../../helpers/RequestResolver';
import { pprint, perror } from '../../helpers/SmartPrint';
import date from '../../helpers/Date/date';
import classes from './Homepage.module.css';
import { HugeVideoPreview, Carousel } from '../../components/Video';
import { TabBar } from '../../components/TabBar';
import { Whatshot, Subscriptions, FiberNew, Grade } from "@material-ui/icons";


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
      channel: {
        name: 'Канал Супергероев',
        key: '12312412',
      },
      created: date(channel.uploaded_playlist.video[0].created),
      preview_url: 'https://disima.ru/wp-content/uploads/2016/01/chelovek-muravej-art.jpg',
      rating: 500,
      views: 100500,
    };
    const testPlaylist = [];
    for (let i = 0 ; i < 10; i++){
      testPlaylist.push(testVideo);
    }

    const hot = (
      <div>
        <Carousel channelKey={channelKey} playlist={testPlaylist} label="Видео Про Человека Муравья" />
        <HugeVideoPreview video={testVideo} />
        <HugeVideoPreview video={testVideo} order="reverse" />
        <HugeVideoPreview video={testVideo} />
        <Carousel channelKey={channelKey} playlist={testPlaylist} label="Видео Про Человека Муравья" />
        <HugeVideoPreview video={testVideo} />
        <HugeVideoPreview video={testVideo} order="reverse" />
        <HugeVideoPreview video={testVideo} />
        <Carousel channelKey={channelKey} playlist={testPlaylist} label="Видео Про Человека Муравья" />
        <HugeVideoPreview video={testVideo} />
        <HugeVideoPreview video={testVideo} order="reverse" />
        <HugeVideoPreview video={testVideo} />
      </div>
    );

    const tabs = [
      {
        value: 1,
        label: 'Горячее',
        icon: <Whatshot />,
        container: hot,
      }, {
        value: 2,
        label: 'Свежее',
        icon: <FiberNew />,
        container: hot,
      }, {
        value: 3,
        label: 'Популярное',
        icon: <Grade />,
        container: hot,
      }, {
        value: 4,
        label: 'Подписки',
        icon: <Subscriptions />,
        container: hot,
      },

    ];

    if (isLoaded) {
      result = (
        <div className={classes.root}>
          <TabBar defaultValue={1} tabs={tabs} />
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

export default Homepage;
