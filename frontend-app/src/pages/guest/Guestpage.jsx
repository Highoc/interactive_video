import React, { Component } from 'react';
import {
  Whatshot, FiberNew, Grade,
} from '@material-ui/icons';
import { connect } from 'react-redux';
import { RequestResolver } from '../../helpers/RequestResolver';
import { ContentGenerator } from '../../components/Video';
import { TabBar } from '../../components/TabBar';
import { fetchPop, fetchNew, fetchHot } from '../../store/actions/homepageData';

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
    const {
      fetchPop,
      fetchHot,
      fetchNew,
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
  }

  render() {
    const { hotData, newData, popularData } = this.props;

    let hot = <div />;
    let popular = <div />;
    let news = <div />;

    if (Object.keys(hotData).length !== 0) {
      hot = <ContentGenerator top={hotData.top} compilation={hotData.compilation} />;
    }
    if (Object.keys(popularData).length !== 0) {
      popular = <ContentGenerator top={popularData.top} compilation={popularData.compilation} />;
    }
    if (Object.keys(newData).length !== 0) {
      news = <ContentGenerator top={newData.top} compilation={newData.compilation} />;
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

const mapStateToProps = state => ({
  hotData: state.fetchedData.hot,
  newData: state.fetchedData.new,
  popularData: state.fetchedData.popular,
});

const mapDispatchToProps = dispatch => ({
  fetchHot: () => dispatch(fetchHot()),
  fetchNew: () => dispatch(fetchNew()),
  fetchPop: () => dispatch(fetchPop()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Guestpage);
