/* @flow weak */

/*
 * Component: RebrandingFilter
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
  SET_REBRANDING_FILTERS
} from 'store/actions';

import { FilterAccordionWithCheckbox } from 'components';

import { pushToDataLayer } from 'analytics';
import { getParameterByName, libraryURLPush } from 'utils';
import { withRouter } from 'react-router';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './RebrandingFilter.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class RebrandingFilter extends Component {
  props: {
    data: [],
    rebrandingText: '',
    setRebrandingFilters: () => void,
    rebrandingFilters: [],
    history: {},
    defaultFilters: {},
    toolTip: ''
  };

  static defaultProps = {
    //
  };

  state = {
    selectedOptions: {},
  };

  list = [];

  setRebrandingFiltersObject() {
    const { data, setRebrandingFilters, defaultFilters } = this.props;
    const urlRebranding = getParameterByName('rebranding');
    const rebrandingFilters = urlRebranding ? urlRebranding.split(',') : [];
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

      if (!rebrandingFilters.length && defaultFilters && defaultFilters['Research Category'] &&  defaultFilters['Research Category'][option.FilterOptionsWithImage.optionVal] === true) { // eslint-disable-line
        initialOptions.push(option.FilterOptionsWithImage.optionVal);
        selectedOptions[optionObj.optionVal] = true;
      } else {
        selectedOptions[optionObj.optionVal] = rebrandingFilters.length ? (rebrandingFilters.indexOf(optionObj.optionVal) > -1) : false;
      }
    });

    this.setState({ selectedOptions });
    if (rebrandingFilters.length) {
      setRebrandingFilters(rebrandingFilters);
    } else {
      setRebrandingFilters(initialOptions);
    }
  }

  componentWillReceiveProps(nextProps) {
    let { selectedOptions } = this.state;
    const { rebrandingFilters, data } = nextProps;
    selectedOptions = {};

    data.map((option) => {
      const { optionVal } = option.FilterOptionsWithImage;
      selectedOptions[optionVal] = (rebrandingFilters.indexOf(optionVal) > -1);
    });

    this.setState({ selectedOptions });
  }

  componentWillMount() {
    this.setRebrandingFiltersObject();
  }

  componentDidMount() {
    const { history } = this.props;
    this.unlisten = history.listen(() => {
      this.setRebrandingFiltersObject();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  checkBoxClick = (val, title, e, checkBox) => {
    const { selectedOptions } = this.state;
    const { rebrandingFilters, setRebrandingFilters } = this.props;
    selectedOptions[val] = !checkBox.checked;
    if (val === 'all') {
      Object.keys(selectedOptions).map(opt => {
        selectedOptions[opt] = selectedOptions[val];
        if (selectedOptions[val] === true) {
          if (rebrandingFilters.indexOf(opt) === -1) {
            rebrandingFilters.push(opt);
          }
        } else {
          if (rebrandingFilters.indexOf(opt) > -1) { // eslint-disable-line no-lonely-if
            rebrandingFilters.splice(rebrandingFilters.indexOf(opt), 1);
          }
        }
        return null;
      });
    } else {
      const isAtleastOneDeselected = Object.keys(selectedOptions).filter(opt => (opt !== 'all' && selectedOptions[opt] === false)).length > 0;
      if (isAtleastOneDeselected) {
        selectedOptions.all = false;
        if (rebrandingFilters.indexOf('all') > -1) {
          rebrandingFilters.splice(rebrandingFilters.indexOf('all'), 1);
        }
      } else {
        selectedOptions.all = true;
        if (rebrandingFilters.indexOf('all') === -1) {
          rebrandingFilters.push('all');
        }
      }
    }
    this.setState({ selectedOptions });
    const isFilterApplied = (rebrandingFilters.indexOf(val) > -1);
    const label = `${selectedOptions[val] ? 'Add: ' : 'Remove: '} ${title}`;
    pushToDataLayer('library', 'rebrandingFilterAdded', { label });
    if (selectedOptions[val] === true) {
      if (!isFilterApplied) {
        rebrandingFilters.push(val);
      }
    } else {
      if (isFilterApplied) { // eslint-disable-line no-lonely-if
        rebrandingFilters.splice(rebrandingFilters.indexOf(val), 1);
      }
    }
    setRebrandingFilters(Object.assign([], rebrandingFilters));
    if (rebrandingFilters) {
      const urlQuery = `rebranding=${encodeURIComponent(rebrandingFilters.join(','))}`;
      libraryURLPush(urlQuery);
    }
  }

  render() {
    const { rebrandingText, toolTip } = this.props;

    const { selectedOptions } = this.state;

    return (
      <div className="rebranding-filter">
        <FilterAccordionWithCheckbox
          selectedOptions={selectedOptions}
          heading={rebrandingText}
          list={this.list}
          checkBoxClick={this.checkBoxClick}
          isRebranding={true}
          toolTip={toolTip}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rebrandingFilters: librarySelector.getRebrandingFilters(state)
});

const mapDispatchToProps = (dispatch) => ({
  setRebrandingFilters: (data) => {
    dispatch({ type: SET_REBRANDING_FILTERS, data });
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RebrandingFilter));
