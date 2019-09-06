/* @flow weak */

/*
 * Component: AdditionalFilter
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { FilterAccordionWithCheckbox } from 'components';
import { connect } from 'react-redux';
import {
  librarySelector
} from 'store/selectors';
import {
  SET_ADDITIONAL_FILTERS
} from 'store/actions';
import { pushToDataLayer } from 'analytics';
import { getParameterByName, libraryURLPush } from 'utils';
import { withRouter } from 'react-router';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AdditionalFilter.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AdditionalFilter extends Component {
  props: {
    data: [],
    additionalText: '',
    setAdditionalFilters: () => void,
    additionalFilters: [],
    history: {},
    defaultFilters: {}
  };

  static defaultProps = {
    //
  };

  state = {
    selectedOptions: {}
  };

  setAdditionalFiltersObject() {
    const { data, setAdditionalFilters, defaultFilters } = this.props;
    const urlAdditional = getParameterByName('additional');
    const additionalFilters = urlAdditional ? urlAdditional.split(',') : [];
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

      if (!additionalFilters.length && defaultFilters && defaultFilters['Additional Filter'] && defaultFilters['Additional Filter'][option.FilterOptionsWithImage.optionVal] === true) { // eslint-disable-line
        initialOptions.push(option.FilterOptionsWithImage.optionVal);
        selectedOptions[optionObj.optionVal] = true;
      } else {
        selectedOptions[optionObj.optionVal] = additionalFilters.length ? (additionalFilters.indexOf(optionObj.optionVal) > -1) : false;
      }
    });

    this.setState({ selectedOptions });
    if (additionalFilters.length) {
      setAdditionalFilters(additionalFilters);
    } else {
      setAdditionalFilters(initialOptions);
    }
  }

  checkBoxClick = (val, title, e, checkBox) => {
    const { selectedOptions } = this.state;
    const { additionalFilters, setAdditionalFilters } = this.props;
    const isFilterApplied = (additionalFilters.indexOf(val) > -1);

    selectedOptions[val] = !checkBox.checked;
    this.setState({ selectedOptions });

    const label = `${selectedOptions[val] ? 'Add: ' : 'Remove: '} ${title}`;
    pushToDataLayer('library', 'additionalFilterAdded', { label });
    if (selectedOptions[val] === true) {
      if (!isFilterApplied) {
        additionalFilters.push(val);
      }
    } else {
      if (isFilterApplied) { // eslint-disable-line no-lonely-if
        additionalFilters.splice(additionalFilters.indexOf(val), 1);
      }
    }
    setAdditionalFilters(Object.assign([], additionalFilters));
    if (additionalFilters) {
      const urlQuery = `additional=${encodeURIComponent(additionalFilters.join(','))}`;
      libraryURLPush(urlQuery);
    }
  }

  componentWillMount() {
    this.setAdditionalFiltersObject();
  }

  componentDidMount() {
    const { history } = this.props;
    this.unlisten = history.listen(() => {
      this.setAdditionalFiltersObject();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  componentWillReceiveProps(nextProps) {
    let { selectedOptions } = this.state;
    const { additionalFilters } = nextProps;
    selectedOptions = {};
    additionalFilters.map((key) => {
      selectedOptions[key] = true;
    });
    this.setState({ selectedOptions });
  }

  render() {
    const { additionalText } = this.props;
    const { selectedOptions } = this.state;

    return (
      <div className="additional-filter">
        <FilterAccordionWithCheckbox
          selectedOptions={selectedOptions}
          heading={additionalText}
          list={this.list}
          checkBoxClick={this.checkBoxClick}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  additionalFilters: librarySelector.getAdditionalFilters(state)
});

const mapDispatchToProps = (dispatch) => ({
  setAdditionalFilters: (data) => {
    dispatch({ type: SET_ADDITIONAL_FILTERS, data });
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdditionalFilter));
