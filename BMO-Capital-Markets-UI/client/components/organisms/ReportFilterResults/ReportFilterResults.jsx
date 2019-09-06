/* @flow weak */

/*
 * Component: ReportFilterResults
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { List, Button, Icon, Loader } from 'unchained-ui-react';
import { PublicationCardSmall } from 'components';
import st from 'constants/strings';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ReportFilterResults.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ReportFilterResults extends Component {
  props: {
    data: [],
    isLoggedIn: bool,
    onShowFiltersBtnClick: () => void,
    bookmarks: [],
    isloading: bool,
    sortCall: () => void,
    resetSort: bool,
    resetBackSort: () => void,
    showMoreData: () => void,
    total: number,
    count: number,
    pageNo: number,
    isExpand: bool,
    details: bool,
    updateShowMoreOrLessFilter: () => void
  }

  state = {
    toggleState: 'date',
    sortOrder: 'desc',
    ascendingSort: true,
    currentOption: '',
    isOpen: false,
  }

  componentDidMount() {
    // Component ready
  }

  getResultsMarkup() {
    const { data, isLoggedIn, isExpand } = this.props;
    if (!data) return null;
    if (Object.keys(data).length === 0) {
      return <div className={'no-results-found'}>No Results Found</div>;
    }
    return (
      <div className={'result-table'}>
        <List className={`result-cards expand-${isExpand}`}>
          {
            data.map((publicationCard) => {
              return (
                <List.Item key={publicationCard._source.productID}>
                  <PublicationCardSmall
                    bookmarks={this.props.bookmarks || []}
                    data={publicationCard}
                    isLoggedIn={isLoggedIn}
                    parentComponent={'Strategy Reports'}
                  />
                </List.Item>
              );
            })
          }
        </List>
      </div>
    );
  }

  optionSelected = (data) => () => {
    this.setState({ isOpen: false, currentOption: data.text, currentValue: data.value });
  }

  openOptionDiv = () => () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  onSortClick = () => (event) => {
    event.stopPropagation();
    const { ascendingSort, currentValue } = this.state;
    let sortOrder = 'asc';
    if (ascendingSort) {
      sortOrder = 'desc';
    }
    this.setState({ ascendingSort: !ascendingSort, isOpen: false });
    this.props.sortCall(currentValue, sortOrder);
  }

  componentWillReceiveProps(nextProps) {
    const { resetSort } = nextProps;
    if (resetSort) {
      this.setState({ sortOrder: 'desc', toggleState: 'date', ascendingSort: true });
      this.props.resetBackSort();
    }
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
    this.setState({ toggleState: name, sortOrder });
    this.props.sortCall(name, sortOrder);
  }

  render() {
    const { toggleState, sortOrder, ascendingSort, currentOption, isOpen } = this.state;
    const { data, details, onShowFiltersBtnClick, total, count, pageNo, isloading, showMoreData, updateShowMoreOrLessFilter } = this.props;
    const mobTitleOption = [
      { key: '1', text: 'Date', value: 'date' },
      { key: '4', text: 'Ticker', value: 'ticker' },
      { key: '4', text: 'Author', value: 'author' },
      { key: '4', text: 'Subject', value: 'subject' },
    ];
    const selectedText = currentOption ? `Sort by ${currentOption}` : `Sort by ${mobTitleOption[0].text}`;
    const selectedOption = currentOption || mobTitleOption[0].text;
    const sortingIcon = ascendingSort ? 'solid-triangle-up' : 'solid-triangle-down';
    return (
      <div className="report-filter-results">
        <div className="search-result">
          <Button className={'linkBtn filter-btn bmo_chevron right'} onClick={() => { onShowFiltersBtnClick(); }}>{'Filters'}</Button>
          {
            data ?
              <div className="search-result-count">
                <span className="search-summary">{`${total} Results`}</span>
              </div>
              :
              null
          }
          <div className="title-bar desktop-view">
            <div className="result-column icon date">
              <Button className={'linkBtn btn-text-color'} onClick={() => this.toggleState('date')}>
                <span className={`${toggleState === 'date' ? 'underline' : ''}`}>{'Date'}</span>
                <Icon name={(toggleState === 'date' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Date'} />
              </Button>
            </div>
            <div className="result-column icon author">
              <Button className="linkBtn btn-text-color" onClick={() => this.toggleState('author')}>
                <span className={`${toggleState === 'author' ? 'underline' : ''}`}>{'Author'}</span>
                <Icon name={(toggleState === 'author' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Author'} />
              </Button>
            </div>
            <div className="result-column icon ticker">
              <Button className={'linkBtn btn-text-color'} onClick={() => this.toggleState('ticker')}>
                <span className={`${toggleState === 'ticker' ? 'underline' : ''}`}>{'Ticker'}</span>
                <Icon name={(toggleState === 'ticker' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Ticker'} />
              </Button>
            </div>
            <div className="result-column icon subject">
              <Button className="linkBtn btn-text-color" onClick={() => this.toggleState('subject')}>
                <span className={`${toggleState === 'subject' ? 'underline' : ''}`}>{'Subject'}</span>
                <Icon name={(toggleState === 'subject' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Subject'} />
              </Button>
            </div>
            <div className="result-column icon user-pref">
              <Button className="linkBtn btn-text-color" onClick={updateShowMoreOrLessFilter}>
                <span >{!details ? 'Show More Detail' : 'Show Less Detail' }</span>
                <Icon className="showMoreLessIcon" name={!details ? 'angle down' : 'angle up'} title={st.showMoreLess} />
              </Button>
            </div>
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
        {isloading && pageNo === 0 ? <div className={'loader-container'}><Loader active={true} content="Loading..." /></div> : null}
        {
          !isloading || pageNo > 0 ?
            <div>
              {this.getResultsMarkup()}
              {
                isloading && (
                  <div className="load-more-button"><Button className="load-more">{'Loading...'}</Button></div>
                )
              }
              { !isloading && total && (total >= (count)) && (total !== count) ?
                <div className="load-more-button"><Button onClick={() => showMoreData()} className="load-more">{'Load More Results'}</Button></div>
                : null
              }
            </div>
            :
            null
        }
      </div>
    );
  }
}

export default ReportFilterResults;
