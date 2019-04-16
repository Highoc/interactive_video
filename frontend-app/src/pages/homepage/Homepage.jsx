import React, { Component } from 'react';
import {
  Whatshot, Subscriptions, FiberNew, Grade,
} from '@material-ui/icons';
import { RequestResolver } from '../../helpers/RequestResolver';
import { pprint, perror } from '../../helpers/SmartPrint';
import { ContentGenerator } from '../../components/Video';
import { TabBar } from '../../components/TabBar';
import NotReady from '../notReady/NotReady';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      hotPlaylist: [],
      popularPlaylist: [],
      newPlaylist: [],
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const hotPlaylist = await this.backend().get('core/top/?type=hot');
      pprint('hotPlaylist', hotPlaylist.data);
      this.setState({ hotPlaylist: hotPlaylist.data, isLoaded: true });

      const popularPlaylist = await this.backend().get('core/top/?type=popular');
      pprint('popularPlaylist', popularPlaylist.data);
      this.setState({ popularPlaylist: popularPlaylist.data });

      const newPlaylist = await this.backend().get('core/top/?type=new');
      pprint('newPlaylist', newPlaylist.data);
      this.setState({ newPlaylist: newPlaylist.data });
    } catch (error) {
      perror('HomePage', error);
    }
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <div />;
    }

    const {
      newPlaylist, hotPlaylist, popularPlaylist,
    } = this.state;

    const tabs = [
      {
        value: 1,
        label: 'Горячее',
        icon: <Whatshot />,
        container: <ContentGenerator top={hotPlaylist.top} compilation={hotPlaylist.compilation} />,
      }, {
        value: 2,
        label: 'Свежее',
        icon: <FiberNew />,
        container: <ContentGenerator top={newPlaylist.top} compilation={newPlaylist.compilation} />,
      }, {
        value: 3,
        label: 'Популярное',
        icon: <Grade />,
        container: <ContentGenerator top={popularPlaylist.top} compilation={popularPlaylist.compilation} />,
      }, {
        value: 4,
        label: 'Подписки',
        icon: <Subscriptions />,
        container: <NotReady />,
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
