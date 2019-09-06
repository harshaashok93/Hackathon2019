/* @flow weak */

/*
 * Component: BmoModelsReportResultSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { List, Button, Icon, Loader } from 'unchained-ui-react';
import { BmoModelResultCard } from 'components';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './BmoModelsReportResultSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class BmoModelsReportResultSection extends Component {
  props: {
    data: [],
    isLoggedIn: bool,
    bookmarks: [],
    onSort: () => void,
    api: '',
    isloading: bool,
    pageNo: number,
    total: number,
    resetdata: () => void,
  }

  state = {
    isExpand: false,
    toggleState: 'date',
    sortOrder: 'desc',
    ascendingSort: false,
    currentOption: '',
    isOpen: false,
    currentValue: 'date'
  }

  componentWillUnmount() {
    this.props.resetdata();
  }

  getResultsMarkup() {
    const { data, isLoggedIn } = this.props;
    const { isExpand } = this.state;
    if (!data) return null;
    if (Object.keys(data).length === 0) {
      return <div className={'no-results-found'}>No Results Found</div>;
    }
    return (
      <List className={`result-cards expand-${isExpand.toString()}`}>
        {
          data.map((item, i) => {
            const keyItem = i + 1;
            return (
              <List.Item key={keyItem}>
                <BmoModelResultCard api={this.props.api} BMOmodel={true} bookmarks={this.props.bookmarks || []} data={item} isLoggedIn={isLoggedIn} />
              </List.Item>
            );
          })
        }
      </List>
    );
  }

  optionSelected = (data) => () => {
    const { ascendingSort } = this.state;
    let sortOrder = 'desc';//eslint-disable-line
    if (ascendingSort) {
      sortOrder = 'asc';
    }
    this.setState(
      {
        isOpen: false,
        currentOption: data.text,
        currentValue: data.value
      },
      () => this.props.onSort(data.value, sortOrder)
    );
  }

  openOptionDiv = () => () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  onSortClick = () => (event) => {
    event.stopPropagation();
    const { ascendingSort, currentValue } = this.state;//eslint-disable-line
    let sortOrder = 'asc';//eslint-disable-line
    if (ascendingSort) {
      sortOrder = 'desc';
    }
    this.setState({ ascendingSort: !ascendingSort, isOpen: false }, () => this.props.onSort(currentValue, sortOrder));
  }

  toggleState = (name) => {
    const { toggleState } = this.state;
    let { sortOrder } = this.state;
    if (toggleState === name) {
      if (sortOrder === 'asc') {
        sortOrder = 'desc';
      } else {
        sortOrder = 'asc';
      }
    } else {
      sortOrder = 'asc';
    }
    this.setState({ toggleState: name, sortOrder }, () => this.props.onSort(name, sortOrder));
  }

  render() {
    const { toggleState, sortOrder, ascendingSort, currentOption, isOpen } = this.state;
    const { data, total } = this.props;
    const mobTitleOption = [
      { key: '1', text: 'Date', value: 'date' },
      { key: '4', text: 'Ticker', value: 'ticker' },
      { key: '4', text: 'Author', value: 'author' },
      { key: '4', text: 'Company', value: 'title' },
    ];
    const selectedText = currentOption ? `Sort by ${currentOption}` : `Sort by ${mobTitleOption[0].text}`;
    const selectedOption = currentOption || mobTitleOption[0].text;
    const sortingIcon = ascendingSort ? 'solid-triangle-up' : 'solid-triangle-down';
    return (
      <div className="bmo-models-report-result-section">
        <div className="search-result">
          {
            data && !this.props.isloading ?
              <div className="search-result-count">
                <span className="search-summary">{total === 1 ? `${total} Result` : `${total} Results`}</span>
              </div>
              :
              null
          }
          <div className="title-bar desktop-view">
            <div className="result-column icon date">
              <Button className={'linkBtn'} onClick={() => this.toggleState('date')}>
                <span className={`${toggleState === 'date' ? 'underline' : ''}`}>{'Date'}</span>
                <Icon name={(toggleState === 'date' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Date'} />
              </Button>
            </div>
            <div className="result-column icon ticker">
              <Button className={'linkBtn'} onClick={() => this.toggleState('ticker')}>
                <span className={`${toggleState === 'ticker' ? 'underline' : ''}`}>{'Ticker'}</span>
                <Icon name={(toggleState === 'ticker' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Ticker'} />
              </Button>
            </div>
            <div className="result-column icon author">
              <Button className={'linkBtn'} onClick={() => this.toggleState('author')}>
                <span className={`${toggleState === 'author' ? 'underline' : ''}`}>{'Author'}</span>
                <Icon name={(toggleState === 'author' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Author'} />
              </Button>
            </div>
            <div className="result-column icon subject">
              <Button className="linkBtn" onClick={() => this.toggleState('title')}>
                <span className={`${toggleState === 'title' ? 'underline' : ''}`}>{'Company'}</span>
                <Icon name={(toggleState === 'title' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Company'} />
              </Button>
            </div>
            <div className="result-column icon user-pref" />
          </div>
        </div>
        <div className="mobile-view">
          <div className={'title-bar'}>
            <span className="title-bar-sort-text">{selectedText}</span>
            <Button className={'sorting-icon-btn'} onClick={this.onSortClick()}><div className={`${sortingIcon}`} /></Button>
            <Button className={`linkBtn ${isOpen ? 'bmo_chevron' : 'bmo_chevron bottom'}`} onClick={this.openOptionDiv()} />
          </div>
          {isOpen &&
            <div className={'options-div'}>
              <List>
                {
                  mobTitleOption.map((data) => {
                    return (
                      <List.Item onClick={this.optionSelected(data)}>
                        <div className={'single-option'}>
                          <span className={`${selectedOption === data.text ? 'selected-value' : ''}`}>{data.text}</span>
                          <div className={`${selectedOption === data.text ? 'bmo_chevron tick' : ''}`} />
                        </div>
                      </List.Item>
                    );
                  })
                }
              </List>
            </div>
          }
        </div>
        {this.props.isloading && this.props.pageNo === 1 ?
          <div className={'loader-container'}><Loader active={true} content="Loading..." /></div>
          :
          this.getResultsMarkup()
        }
      </div>
    );
  }
}

export default BmoModelsReportResultSection;
