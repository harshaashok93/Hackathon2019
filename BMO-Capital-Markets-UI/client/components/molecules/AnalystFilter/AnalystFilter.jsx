/* @flow weak */

/*
 * Component: AnalystFilter
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Accordion, Label, Dropdown, Button } from 'unchained-ui-react';
import { RichText } from 'components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import escapeRegExp from 'lodash/truncate';
import {
  SET_AUTHOR_FILTER
} from 'store/actions';
import {
  librarySelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AnalystFilter.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AnalystFilter extends Component {
  props: {
    setAnalystFilter: () => void,
    authorFilter: '',
    analystResults: []
  };

  static defaultProps = {
  };

  state = {
    analystSelectedValue: '',
    displayValue: ''
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    const { setAnalystFilter } = this.props;
    this.setState({ displayValue: '', analystSelectedValue: '' });
    setAnalystFilter('');
  }
  componentWillReceiveProps(nextProps) {
    const { authorFilter } = nextProps;
    this.setState({ displayValue: authorFilter, analystSelectedValue: '' });
  }

  handleAnalystSearchChange = (e, value) => {
    // Setting the state when a result is selected from the dropdown
    this.setState({
      analystSelectedValue: value.toLowerCase(),
    });
  }

  handleResultSelect = (obj) => (e, value) => {//eslint-disable-line
    const { setAnalystFilter } = this.props;
    const personid = obj.value;
    this.setState({ displayValue: personid || '' });
    setAnalystFilter(personid || '');
  }

  handleAnalystReset = () => {
    const { setAnalystFilter } = this.props;
    this.setState({ displayValue: '' }, () => {
      setAnalystFilter('');
    });
  }

  renderDropdownMenu(analystResults) {
    const { analystSelectedValue } = this.state;
    let noResult = 0;

    let content = (
      <Dropdown.Menu>
        {analystResults.map((option) => {
          const keyProps = `i-${option.key}`;
          if (analystSelectedValue === '') {
            return <Dropdown.Item key={keyProps} {...option} onClick={this.handleResultSelect(option)} />;
          } else if (analystSelectedValue && option.text.toLowerCase().includes(analystSelectedValue)) {
            const re = new RegExp(escapeRegExp(analystSelectedValue.toLowerCase()), 'gi');
            const modifiedTitle = option.text.replace(re, '<strong>$&</strong>');
            return (
              <Dropdown.Item key={keyProps} onClick={this.handleResultSelect(option)}>
                <RichText richText={modifiedTitle} />
              </Dropdown.Item>
            );
          }
          noResult += 1;
          return null;
        })}
      </Dropdown.Menu>
    );

    if (analystSelectedValue && (noResult === analystResults.length)) {
      content = (
        <Dropdown.Menu>
          <Dropdown.Item>No Results Found.</Dropdown.Item>
        </Dropdown.Menu>
      );
    }
    return content;
  }

  render() {
    const { displayValue } = this.state;
    const { analystResults } = this.props;
    return (
      <div className="analyst-filter">
        <Accordion defaultActiveIndex={0}>
          <Accordion.Title>
            <i aria-hidden="true" className="bmo_chevron bottom" />
            <Label content={'Author'} className={'filter-name'} />
          </Accordion.Title>
          <Accordion.Content>
            <Dropdown
              placeholder={'Search'}
              onSearchChange={this.handleAnalystSearchChange}
              selection
              search
              value={displayValue}
              className="searchBox"
              options={analystResults}
              icon={'search'}
              selectOnBlur={false}
              noResultsMessage
            >
              {this.renderDropdownMenu(analystResults)}
            </Dropdown>
            {displayValue ? <Button className="analyst-filter-close-btn analyst-close-button" onClick={this.handleAnalystReset} /> : null}
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authorFilter: librarySelector.getAuthorFilter(state),
  analystResults: librarySelector.getPodcastAuthorList(state)
});

const mapDispatchToProps = (dispatch) => ({
  setAnalystFilter: (personid) => {
    dispatch({ type: SET_AUTHOR_FILTER, data: personid });
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnalystFilter));
