/* @flow weak */

/*
 * Component: ResearchTypeFilter
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
  SET_RESEARCH_FILTERS
} from 'store/actions';
import { pushToDataLayer } from 'analytics';
import { getParameterByName, libraryURLPush } from 'utils';
import { withRouter } from 'react-router';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ResearchTypeFilter.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ResearchTypeFilter extends Component {
  props: {
    data: [],
    researchTypeText: '',
    setResearchFilters: () => void,
    researchFilters: [],
    history: {},
    defaultFilters: {}
  };

  static defaultProps = {
    //
  };

  state = {
    selectedOptions: {}
  };

  list = [];

  setResearchFiltersObject() {
    const urlLocation = getParameterByName('research');
    const researchFilters = urlLocation ? urlLocation.split(',') : [];
    const { data, setResearchFilters, defaultFilters } = this.props;
    const selectedOptions = {};
    const initialOptions = [];

    this.list = [];

    data.map((option) => {
      const optionObj = {
        optionVal: '',
        optionText: '',
        image: ''
      };
      const optionImage = option.FilterOptionsWithImage;

      optionObj.optionVal = optionImage.optionVal;
      optionObj.optionText = optionImage.optionText;
      optionObj.image = optionImage.image;

      if (!researchFilters.length && defaultFilters && defaultFilters['Research Type'] && defaultFilters['Research Type'][optionImage.optionVal] === true) { // eslint-disable-line
        initialOptions.push(optionImage.optionVal);
        selectedOptions[optionObj.optionVal] = true;
      } else {
        selectedOptions[optionObj.optionVal] = researchFilters.length ? (researchFilters.indexOf(optionObj.optionVal) > -1) : false;
      }
      this.list.push(optionObj);
    });

    this.setState({ selectedOptions });
    if (researchFilters.length) {
      setResearchFilters(researchFilters);
    } else {
      setResearchFilters(initialOptions);
    }
  }

  componentWillReceiveProps(nextProps) {
    let { selectedOptions } = this.state;
    const { researchFilters, data } = nextProps;
    selectedOptions = {};

    data.map((option) => {
      const { optionVal } = option.FilterOptionsWithImage;
      selectedOptions[optionVal] = (researchFilters.indexOf(optionVal) > -1);
    });

    this.setState({ selectedOptions });
  }

  componentWillMount() {
    this.setResearchFiltersObject();
  }

  componentDidMount() {
    const { history } = this.props;
    this.unlisten = history.listen(() => {
      this.setResearchFiltersObject();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  checkBoxClick = (val, title, e, checkBox) => {
    const { selectedOptions } = this.state;
    const { researchFilters, setResearchFilters } = this.props;

    selectedOptions[val] = !checkBox.checked;

    if (val === 'all') {
      this.list.map(opt => {
        selectedOptions[opt.optionVal] = selectedOptions[val];
        if (selectedOptions[val] === true) {
          if (researchFilters.indexOf(opt.optionVal) === -1) {
            researchFilters.push(opt.optionVal);
          }
        } else {
          if (researchFilters.indexOf(opt.optionVal) > -1) { // eslint-disable-line no-lonely-if
            researchFilters.splice(researchFilters.indexOf(opt.optionVal), 1);
          }
        }
      });
    } else {
      const isAtleastOneDeselected = Object.keys(selectedOptions).filter(opt => (opt !== 'all' && selectedOptions[opt] === false)).length > 0;
      if (isAtleastOneDeselected) {
        selectedOptions.all = false;
        if (researchFilters.indexOf('all') > -1) {
          researchFilters.splice(researchFilters.indexOf('all'), 1);
        }
      } else {
        selectedOptions.all = true;
        if (researchFilters.indexOf('all') === -1) {
          researchFilters.push('all');
        }
      }
    }
    this.setState({ selectedOptions });
    const label = `${selectedOptions[val] ? 'Add: ' : 'Remove: '} ${title}`;
    pushToDataLayer('library', 'researchFilterAdded', { label });
    const isFilterApplied = (researchFilters.indexOf(val) > -1);
    if (selectedOptions[val] === true) {
      if (!isFilterApplied) {
        researchFilters.push(val);
      }
    } else {
      if (isFilterApplied) { // eslint-disable-line no-lonely-if
        researchFilters.splice(researchFilters.indexOf(val), 1);
      }
    }
    setResearchFilters(Object.assign([], researchFilters));
    if (researchFilters) {
      const urlQuery = `research=${encodeURIComponent(researchFilters.join(','))}`;
      libraryURLPush(urlQuery);
    }
  }

  render() {
    const { researchTypeText } = this.props;
    const { selectedOptions } = this.state;

    return (
      <div className="research-type-filter">
        <FilterAccordionWithCheckbox
          selectedOptions={selectedOptions}
          heading={researchTypeText}
          list={this.list}
          checkBoxClick={this.checkBoxClick}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  researchFilters: librarySelector.getResearchFilters(state)
});

const mapDispatchToProps = (dispatch) => ({
  setResearchFilters: (data) => {
    dispatch({ type: SET_RESEARCH_FILTERS, data });
  },
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResearchTypeFilter));
