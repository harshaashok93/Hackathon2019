/* @flow weak */

/*
 * Component: LocationFilter
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  librarySelector
} from 'store/selectors';
import {
  SET_LOCATION_FILTERS
} from 'store/actions';

import { FilterAccordionWithCheckbox } from 'components';

import { pushToDataLayer } from 'analytics';
import { getParameterByName, libraryURLPush } from 'utils';
import { withRouter } from 'react-router';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LocationFilter.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LocationFilter extends Component {
  props: {
    data: [],
    locationText: '',
    setLocationFilters: () => void,
    locationFilters: [],
    history: {},
    defaultFilters: {}
  };

  static defaultProps = {
    //
  };

  state = {
    selectedOptions: {},
  };

  list = [];

  setLocationFiltersObject() {
    const { data, setLocationFilters, defaultFilters } = this.props;
    const urlLocation = getParameterByName('location');
    const locationFilters = urlLocation ? urlLocation.split(',') : [];
    const selectedOptions = {};
    const initialOptions = [];
    this.list = [];

    data.map((option) => {
      const optionObj = {
        optionVal: '',
        optionText: '',
        image: '',
        altText: '',
      };

      optionObj.optionVal = option.FilterOptionsWithImage.optionVal;
      optionObj.optionText = option.FilterOptionsWithImage.optionText;
      optionObj.image = option.FilterOptionsWithImage.image;
      optionObj.altText = option.FilterOptionsWithImage.altText;
      this.list.push(optionObj);

      if (!locationFilters.length && defaultFilters && defaultFilters.Location &&  defaultFilters.Location[option.FilterOptionsWithImage.optionVal] === true) { // eslint-disable-line
        initialOptions.push(option.FilterOptionsWithImage.optionVal);
        selectedOptions[optionObj.optionVal] = true;
      } else {
        selectedOptions[optionObj.optionVal] = locationFilters.length ? (locationFilters.indexOf(optionObj.optionVal) > -1) : false;
      }
    });

    this.setState({ selectedOptions });
    if (locationFilters.length) {
      setLocationFilters(locationFilters);
    } else {
      setLocationFilters(initialOptions);
    }
  }

  componentWillReceiveProps(nextProps) {
    let { selectedOptions } = this.state;
    const { locationFilters, data } = nextProps;
    selectedOptions = {};

    data.map((option) => {
      const { optionVal } = option.FilterOptionsWithImage;
      selectedOptions[optionVal] = (locationFilters.indexOf(optionVal) > -1);
    });

    this.setState({ selectedOptions });
  }

  componentWillMount() {
    this.setLocationFiltersObject();
  }

  componentDidMount() {
    const { history } = this.props;
    this.unlisten = history.listen(() => {
      this.setLocationFiltersObject();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  checkBoxClick = (val, title, e, checkBox) => {
    const { selectedOptions } = this.state;
    const { locationFilters, setLocationFilters } = this.props;
    selectedOptions[val] = !checkBox.checked;
    if (val === 'all') {
      Object.keys(selectedOptions).map(opt => {
        selectedOptions[opt] = selectedOptions[val];
        if (selectedOptions[val] === true) {
          if (locationFilters.indexOf(opt) === -1) {
            locationFilters.push(opt);
          }
        } else {
          if (locationFilters.indexOf(opt) > -1) { // eslint-disable-line no-lonely-if
            locationFilters.splice(locationFilters.indexOf(opt), 1);
          }
        }
        return null;
      });
    } else {
      const isAtleastOneDeselected = Object.keys(selectedOptions).filter(opt => (opt !== 'all' && selectedOptions[opt] === false)).length > 0;
      if (isAtleastOneDeselected) {
        selectedOptions.all = false;
        if (locationFilters.indexOf('all') > -1) {
          locationFilters.splice(locationFilters.indexOf('all'), 1);
        }
      } else {
        selectedOptions.all = true;
        if (locationFilters.indexOf('all') === -1) {
          locationFilters.push('all');
        }
      }
    }
    this.setState({ selectedOptions });
    const isFilterApplied = (locationFilters.indexOf(val) > -1);
    const label = `${selectedOptions[val] ? 'Add: ' : 'Remove: '} ${title}`;
    pushToDataLayer('library', 'locationFilterAdded', { label });
    if (selectedOptions[val] === true) {
      if (!isFilterApplied) {
        locationFilters.push(val);
      }
    } else {
      if (isFilterApplied) { // eslint-disable-line no-lonely-if
        locationFilters.splice(locationFilters.indexOf(val), 1);
      }
    }
    setLocationFilters(Object.assign([], locationFilters));
    if (locationFilters) {
      const urlQuery = `location=${encodeURIComponent(locationFilters.join(','))}`;
      libraryURLPush(urlQuery);
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   const { selectedOptions } = this.state;
  //   const { locationFilters } = nextProps;
  //   Object.keys(selectedOptions).map((key) => {
  //     selectedOptions[key] = (locationFilters.indexOf(key) > -1);
  //   });
  //   this.setState({ selectedOptions });
  // }

  render() {
    const { locationText } = this.props;

    const { selectedOptions } = this.state;

    return (
      <div className="location-filter">
        <FilterAccordionWithCheckbox
          selectedOptions={selectedOptions}
          heading={locationText}
          list={this.list}
          checkBoxClick={this.checkBoxClick}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  locationFilters: librarySelector.getLocationFilters(state)
});

const mapDispatchToProps = (dispatch) => ({
  setLocationFilters: (data) => {
    dispatch({ type: SET_LOCATION_FILTERS, data });
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LocationFilter));
