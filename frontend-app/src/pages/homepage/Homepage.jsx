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
      let result = await this.backend().get('core/top/?type=hot');
      this.setState({ hotPlaylist: result.data.top });
      pprint('hotPlaylist', result.data);
      result = await this.backend().get('core/top/?type=popular');
      this.setState({ popularPlaylist: result.data.top });
      pprint('popularPlaylist', result.data);
      result = await this.backend().get('core/top/?type=new');
      this.setState({ isLoaded: true, newPlaylist: result.data.top });
      pprint('newPlaylist', result.data);
    } catch (error) {
      perror('HomePage', error);
    }
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }

    const {
      newPlaylist, hotPlaylist, popularPlaylist,
    } = this.state;

    const tabs = [
      {
        value: 1,
        label: 'Горячее',
        icon: <Whatshot />,
        container: <ContentGenerator playlist={hotPlaylist} />,
      }, {
        value: 2,
        label: 'Свежее',
        icon: <FiberNew />,
        container: <ContentGenerator playlist={newPlaylist} />,
      }, {
        value: 3,
        label: 'Популярное',
        icon: <Grade />,
        container: <ContentGenerator playlist={popularPlaylist} />,
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
