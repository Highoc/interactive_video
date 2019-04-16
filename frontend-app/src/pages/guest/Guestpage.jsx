import React, { Component } from 'react';
import {
  Whatshot, FiberNew, Grade,
} from '@material-ui/icons';
import { RequestResolver } from '../../helpers/RequestResolver';
import { pprint, perror } from '../../helpers/SmartPrint';
import { ContentGenerator } from '../../components/Video';
import { TabBar } from '../../components/TabBar';

class Guestpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotPlaylist: [],
      popularPlaylist: [],
      newPlaylist: [],
      isHotLoaded: false,
      isPopularLoaded: false,
      isNewLoaded: false,
    };
    this.backend = RequestResolver.getGuest();
  }

  async componentDidMount() {
    try {
      const hotPlaylist = await this.backend().get('core/top/?type=hot');
      pprint('GuestPageHot', hotPlaylist.data);
      this.setState({ hotPlaylist: hotPlaylist.data, isHotLoaded: true });

      const popularPlaylist = await this.backend().get('core/top/?type=popular');
      pprint('GuestPagePopular', popularPlaylist.data);
      this.setState({ popularPlaylist: popularPlaylist.data, isPopularLoaded: true });

      const newPlaylist = await this.backend().get('core/top/?type=new');
      pprint('GuestPageNew', newPlaylist.data);
      this.setState({ newPlaylist: newPlaylist.data, isNewLoaded: true });
    } catch (error) {
      perror('GuestPage', error);
    }
  }

  render() {
    const {
      newPlaylist, hotPlaylist, popularPlaylist, isHotLoaded, isPopularLoaded, isNewLoaded,
    } = this.state;

    let hot = <div />;
    let popular = <div />;
    let news = <div />;

    if (isHotLoaded) {
      hot = <ContentGenerator top={hotPlaylist.top} compilation={hotPlaylist.compilation} />;
    }
    if (isPopularLoaded) {
      popular = <ContentGenerator top={popularPlaylist.top} compilation={popularPlaylist.compilation} />;
    }
    if (isNewLoaded) {
      news = <ContentGenerator top={newPlaylist.top} compilation={newPlaylist.compilation} />;
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
      },

    ];

    return (
      <div>
        <TabBar defaultValue={1} tabs={tabs} />
      </div>
    );
  }
}

export default Guestpage;
