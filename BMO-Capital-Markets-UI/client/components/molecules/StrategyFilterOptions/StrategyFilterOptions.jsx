/* @flow weak */

/*
 * Component: StrategyFilterOptions
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { List } from 'unchained-ui-react';
import { connect } from 'react-redux';
import {
  SET_STRATEGY_SUB_NAV_OPTION,
} from 'store/actions';

import { pushToDataLayer } from 'analytics';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StrategyFilterOptions.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StrategyFilterOptions extends Component {
  props: {
    data: {},
    text: '',
    setfilterOption: () => void,
    setSelectedText: () => void,
  };

  static defaultProps = {
  };

  state = {
    filterOptions: {},
  }

  componentDidMount() {
    // Component ready
  }

  handleClick = (optionValue) => () => {
    const { filterOptions } = this.state;
    const { setfilterOption, text } = this.props;
    pushToDataLayer('strategy', 'leftNavClick', { label: `${text}:${optionValue}` });
    this.props.setSelectedText(text, true);
    this.props.setSelectedText(text, false);
    filterOptions.map((data) => {
      const dataVal = data;
      if (data.optionVal === optionValue) {
        dataVal.selected = true;
      } else {
        dataVal.selected = false;
      }
    });
    setfilterOption(optionValue);
    this.setState({ filterOptions });
  }

  list = []

  componentWillMount() {
    const { data, setfilterOption } = this.props;
    let selectedOption = '';
    data.map((option) => {
      const optionObj = {
        optionVal: '',
        optionText: '',
        selected: '',
      };
      optionObj.optionVal = option.StrategyFilterOptions.optionVal;
      optionObj.optionText = option.StrategyFilterOptions.optionText;
      optionObj.selected = option.StrategyFilterOptions.selected;
      this.list.push(optionObj);
      if (optionObj.selected) {
        selectedOption = optionObj.optionVal;
      }
    });
    setfilterOption(selectedOption);
    this.setState({ filterOptions: this.list });
  }

  render() {
    const { filterOptions } = this.state;
    return (
      <List className={'strategy-filter-option'}>
        {filterOptions.map((data) => {
          return (
            <List.Item key={Math.random()} className={`strategy-filter-options ${data.selected ? 'bold-text' : ''}`} onClick={this.handleClick(data.optionVal)}>
              {data.optionText}
              {data.selected && <span className="bmo_chevron tick" />}
            </List.Item>
          );
        })
        }
      </List>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setfilterOption: (data) => {
    dispatch({ type: SET_STRATEGY_SUB_NAV_OPTION, data });
  }
});

export default connect(null, mapDispatchToProps)(StrategyFilterOptions);
