import React, { Component } from 'react';
import {
  Whatshot, Subscriptions, FiberNew, Grade,
} from '@material-ui/icons';
import { connect } from 'react-redux';
import { RequestResolver } from '../../helpers/RequestResolver';
import { ContentGenerator } from '../../components/Video';
import { TabBar } from '../../components/TabBar';
import Carousel from '../../components/Video/Carousel/Carousel';
import {
  fetchHot, fetchNew, fetchPop, fetchSubs,
} from '../../store/actions/homepageData';

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
    const {
      fetchPop,
      fetchHot,
      fetchNew,
      fetchSubs,
      subsData,
      hotData,
      newData,
      popularData,
    } = this.props;
    if (Object.keys(hotData).length === 0) {
      fetchHot();
    }
    if (Object.keys(popularData).length === 0) {
      fetchPop();
    }
    if (Object.keys(newData).length === 0) {
      fetchNew();
    }
    if (Object.keys(subsData).length === 0) {
      fetchSubs();
    }
  }

  render() {
    const {
      hotData, newData, popularData, subsData,
    } = this.props;

    let hot = <div />;
    let popular = <div />;
    let news = <div />;
    let subs = <div />;


    if (Object.keys(hotData).length !== 0) {
      hot = <ContentGenerator top={hotData.top} compilation={hotData.compilation} />;
    }
    if (Object.keys(popularData).length !== 0) {
      popular = <ContentGenerator top={popularData.top} compilation={popularData.compilation} />;
    }
    if (Object.keys(newData).length !== 0) {
      news = <ContentGenerator top={newData.top} compilation={newData.compilation} />;
    }

    if (Object.keys(subsData).length !== 0) {
      subs = subsData.map(channel => <Carousel key={channel.key} playlist={channel.list} label={channel.name} />);
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

const mapStateToProps = state => ({
  hotData: state.fetchedData.hot,
  newData: state.fetchedData.new,
  popularData: state.fetchedData.popular,
  subsData: state.fetchedData.subscriptions,
});

const mapDispatchToProps = dispatch => ({
  fetchHot: () => dispatch(fetchHot()),
  fetchNew: () => dispatch(fetchNew()),
  fetchPop: () => dispatch(fetchPop()),
  fetchSubs: () => dispatch(fetchSubs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
