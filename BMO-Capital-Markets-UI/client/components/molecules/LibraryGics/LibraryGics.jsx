/* @flow weak */

/*
 * Component: LibraryGics
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Accordion, Button, Label } from 'unchained-ui-react';
import { GicTree } from 'components';
import { libraryURLPush, getParameterByName } from 'utils';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  librarySelector,
  searchSelector
} from 'store/selectors';
import {
  SET_GICS_TYPE,
  RESET_GICS_TYPE,
  RESET_SEARCH_TYPE,
  SET_SEARCH_TYPE
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LibraryGics.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LibraryGics extends Component {
  props: {
    data: {},
    LibraryGicsText: '',
    setGicsType: () => void,
    resetGicsType: () => void,
    gicsType: {},
    history: {},
    resetSearchType: () => void,
    setSearchType: () => void,
    LibraryGicsDescription: ''
  };

  static defaultProps = {
    LibraryGicsText: '',
  };

  state = {
    showGicTree: false,
    selectedGic: {},
  };

  componentWillReceiveProps(nextProps) {
    let { selectedGic } = this.state;
    const { gicsType } = nextProps;
    selectedGic = {};

    if (gicsType) {
      selectedGic = {
        name: gicsType.name
      };
    }

    // if (searchEvent) {
    //   selectedGic = {
    //     name: ''
    //   };
    // }

    this.setState({ selectedGic });
  }

  setSearchTypeObject() {
    const gicsType = getParameterByName('gics');

    if (gicsType) {
      const data = { name: decodeURIComponent(gicsType) };
      this.setState({ selectedGic: data });
      this.props.setGicsType(data);
    } else {
      this.props.resetGicsType();
    }

    const urlSearchType = getParameterByName('searchType');
    const urlSearchValue = getParameterByName('searchVal');

    if (urlSearchType && urlSearchValue) {
      const data = {
        type: urlSearchType,
        displayValue: decodeURIComponent(urlSearchValue)
      };
      const urlSearchTicker = getParameterByName('searchTicker');
      if (urlSearchTicker) {
        data.value = {
          ticker: decodeURIComponent(urlSearchTicker)
        };
      }
      this.props.setSearchType(data);
    } else {
      this.props.resetSearchType();
    }
  }

  componentDidMount() {
    const { history } = this.props;
    this.setSearchTypeObject();
    this.unlisten = history.listen(() => {
      this.setSearchTypeObject();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  showGicTree = () => this.setState({ showGicTree: true }, () => {
    document.body.classList.add('noscroll-thank');
  });

  closeGicTree = (branch) => {
    if (branch !== null) {
      let urlQuery = '';
      this.setState({ selectedGic: branch });
      if (branch.gics_code) {
        urlQuery = `gics=${encodeURIComponent(branch.name)}`;
        libraryURLPush(urlQuery, 'searchType,searchVal,searchTicker');
      } else {
        urlQuery = `gics=${encodeURIComponent(branch.name)}&searchType=industry&searchVal=${encodeURIComponent(branch.name)}&fromGics=true&sectorId=${encodeURIComponent(branch.id)}`;
        libraryURLPush(urlQuery, 'searchTicker');
        this.props.setSearchType({ type: 'industry', displayValue: branch.name, value: branch.name });
      }
      this.setSearchTypeObject();
    }
    // const type = 'GICS';
    // this.props.setSearchType({ type, displayValue: branch.name, value: branch.name });
    this.setState({ showGicTree: false }, () => {
      document.body.classList.remove('noscroll-thank');
    });
  };

  removeSelectedGic() {
    this.setState({ selectedGic: {} }, () => {
      const isFromGics = getParameterByName('fromGics');
      if (isFromGics === 'true') {
        libraryURLPush(window.location.search.replace('?', ''), 'gics,fromGics,searchType,searchVal,sectorId');
        this.props.resetSearchType();
      } else {
        libraryURLPush(window.location.search.replace('?', ''), 'gics');
      }
      this.props.resetGicsType();
    });
    // this.props.setSearchType({ type: null, displayValue: null, value: null });
  }

  render() {
    const { LibraryGicsText, data, LibraryGicsDescription } = this.props;
    const { showGicTree, selectedGic } = this.state;

    return (
      <div className="library-gics">
        <Accordion defaultActiveIndex={0} activeIndex={0}>
          <Accordion.Title>
            {selectedGic && selectedGic.name ? null : <i aria-hidden="true" className="bmo_chevron right" onClick={this.showGicTree} />}
            <Label
              as={Button}
              content={LibraryGicsText}
              onClick={this.showGicTree}
              className={'filter-name'}
            />
          </Accordion.Title>
          <Accordion.Content>
            {
              selectedGic && selectedGic.name ?
                <div className="text">
                  <Button className="bmo-close-btn remove-gic-btn" onClick={() => this.removeSelectedGic()} />
                  {selectedGic.name}
                </div>
                :
                <Label
                  as={Button}
                  content={LibraryGicsDescription || 'Select a GIC'}
                  onClick={this.showGicTree}
                  className={'no-selection'}
                />
            }
          </Accordion.Content>
        </Accordion>
        {
          showGicTree ?
            <GicTree tree={data} closeGicTree={(node) => this.closeGicTree(node)} />
            : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  gicsType: librarySelector.getGicsFilter(state),
  searchEvent: searchSelector.getSearchEvent(state),
});

const mapDispatchToProps = (dispatch) => ({
  setGicsType: (data) => dispatch({ type: SET_GICS_TYPE, data }),
  setSearchType: (data) => dispatch({ type: SET_SEARCH_TYPE, data }),
  resetGicsType: () => {
    dispatch({ type: RESET_GICS_TYPE });
  },
  resetSearchType: () => {
    dispatch({ type: RESET_SEARCH_TYPE });
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LibraryGics));
