import React, { Component } from 'react';
import {
  Whatshot, Subscriptions, FiberNew, Grade,
} from '@material-ui/icons';
import { RequestResolver } from '../../helpers/RequestResolver';
import { pprint, perror } from '../../helpers/SmartPrint';
import { ContentGenerator } from '../../components/Video';
import { TabBar } from '../../components/TabBar';
import Carousel from '../../components/Video/Carousel/Carousel';
import NotReady from '../notReady/NotReady';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotPlaylist: [],
      popularPlaylist: [],
      newPlaylist: [],
      subsPlaylist: [],
      isHotLoaded: false,
      isPopularLoaded: false,
      isNewLoaded: false,
      isSubsLoaded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const hotPlaylist = await this.backend().get('core/top/?type=hot');
      pprint('HomepageHotPlaylist', hotPlaylist.data);
      this.setState({ hotPlaylist: hotPlaylist.data, isHotLoaded: true });

      const popularPlaylist = await this.backend().get('core/top/?type=popular');
      pprint('HomepagePopularPlaylist', popularPlaylist.data);
      this.setState({ popularPlaylist: popularPlaylist.data, isPopularLoaded: true });

      const newPlaylist = await this.backend().get('core/top/?type=new');
      pprint('HomepageNewPlaylist', newPlaylist.data);
      this.setState({ newPlaylist: newPlaylist.data, isNewLoaded: true });

      const subsPlaylist = await this.backend().get('core/top/subscriptions/');
      pprint('HomepageSubsPlaylist', subsPlaylist.data);
      this.setState({ subsPlaylist: subsPlaylist.data, isSubsLoaded: true });
    } catch (error) {
      perror('HomePage', error);
    }
  }

  render() {
    const {
      newPlaylist, hotPlaylist, popularPlaylist, subsPlaylist, isHotLoaded, isPopularLoaded, isNewLoaded, isSubsLoaded,
    } = this.state;


    let hot = <div />;
    let popular = <div />;
    let news = <div />;
    let subs = <div />;


    if (isHotLoaded) {
      hot = <ContentGenerator top={hotPlaylist.top} compilation={hotPlaylist.compilation} />;
    }
    if (isPopularLoaded) {
      popular = <ContentGenerator top={popularPlaylist.top} compilation={popularPlaylist.compilation} />;
    }
    if (isNewLoaded) {
      news = <ContentGenerator top={newPlaylist.top} compilation={newPlaylist.compilation} />;
    }

    if (isSubsLoaded) {
      subs = subsPlaylist.map(channel => <Carousel key={channel.key} playlist={channel.list} label={channel.name} />);
    }

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
        container: news,
      }, {
        value: 3,
        label: 'Популярное',
        icon: <Grade />,
        container: popular,
      }, {
        value: 4,
        label: 'Подписки',
        icon: <Subscriptions />,
        container: subs,
      },

    ];

    return (
      <div>
        <TabBar defaultValue={1} tabs={tabs} />
      </div>
    );
  }
}

export default Homepage;
