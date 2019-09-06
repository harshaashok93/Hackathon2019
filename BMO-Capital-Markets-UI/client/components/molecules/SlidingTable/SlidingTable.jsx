/* @flow weak */

/*
 * Component: SlidingTable
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Modal, Grid, Container, Loader } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './SlidingTable.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class SlidingTable extends Component {
  props: {
    resultLeft: [[], []],
    headerLeft: [],
    headerRight: [],
    resultRight: [[], []],
    isResultLoaded: boolean,
    miniSummary: '',
    fromStockScreener: boolean,
    data: [],
    sortTableBy: () => void,
    filteredResultCount: number,
    handleGTM: () => void,
    sortClick: bool,
  };

  state = {
    isOpen: false,
    wrapper1Width: 0,
    rowData: [],
    rightOrder: [
      'RatingDesc',
      'ClosingPrice',
      'TargetPrice',
      'TotalReturn',
      'CurrentEPS',
      'CurrentPE',
      'NextEPS',
      'NextPE',
      'Proj2YrEPSGrowth',
      'Yield',
      'PriceChange1Yr',
      'MarketCap',
    ],
    sortOrder: 'company'
  }

  hideBodyScroll = () => () => {
    document.body.style.overflow = 'hidden';
  }

  showBodyScroll = () => () => {
    document.body.style.overflow = '';
  }

  setModal = (data) => {
    this.setState({ rowData: data, isOpen: true });
  }

  modalOpen = () => {
    const { isOpen, rowData, rightOrder } = this.state;
    const { headerRight } = this.props;
    const toUrl = `/library/?searchType=company&searchVal=${encodeURIComponent(rowData.CompanyName)}&searchTicker=${encodeURIComponent(rowData.CompanyTicker)}`;
    return (
      <Modal
        open={isOpen}
        className={'stock-screener-mobile-overlay'}
        onMount={this.hideBodyScroll()}
        onUnmount={this.showBodyScroll()}
      >
        <Modal.Content>
          <Grid>
            <div className="close-button-bar">
              <Button className="close-button mega-menu-close-icon bmo-close-btn" onClick={() => this.setState({ isOpen: false })} />
            </div>
            <Container
              className={'heading-overlay'}
              as={rowData.CompanyTicker ? NavLink : 'div'}
              to={rowData.CompanyTicker ? toUrl : ''}
              onClick={() => this.props.handleGTM('companyClick', rowData.CompanyName, rowData.CompanyName)}
            >
              {rowData.CompanyName}<br />{rowData.CompanyTicker ? ` (${rowData.CompanyTicker})` : ''} {rowData.FiscalYear}
            </Container>
            <Grid.Row>
              <Grid.Column className="overlay-column left" mobile={6} tablet={6} computer={3}>
                { headerRight.map((row, i) => <div className={`aResultRow row-color-${(i % 2).toString()}`}>{row.text}</div>)}
              </Grid.Column>
              <Grid.Column className="overlay-column right" mobile={6} tablet={6} computer={3}>
                { rightOrder.map((row, i) => <div className={`aResultRow row-color-${(i % 2).toString()}`}>{rowData[row]}</div>)}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }

  getMobileView = () => {
    const { resultLeft, resultRight, headerRight, fromStockScreener, data } = this.props;
    const { sortOrder } = this.state;

    if (resultLeft && resultRight && resultRight.length && resultLeft.length) {
      const headerSection = (
        <div className="header">
          {fromStockScreener === false ?
            <div className={'mob-company-name'} tabIndex={0} role={'button'} onKeyPress={() => {}} onClick={this.sortTableBy('company')}>
              <span className="text">{'Company'}</span>
              <i aria-hidden="true" className={sortOrder === 'company' ? 'caret up icon' : 'caret down icon'} />
            </div>
            :
            null
          }
          <div>
            {
              headerRight.slice(0, 4).map((row) => {
                return (
                  <div className="cell" tabIndex={0} role={'button'} onKeyPress={() => {}} onClick={this.sortTableBy(row.key)}>
                    <span className="text">{row.text}</span>
                    <i aria-hidden="true" className={sortOrder === row.key ? 'caret up icon' : 'caret down icon'} />
                  </div>
                );
              }
              )
            }
          </div>
        </div>
      );
      const bodySection = (
        <div className="result-rows-holder">
          {
            !fromStockScreener ?
              resultLeft.map((leftRow, i) => {
                const companyName = leftRow[0].split('**')[0];
                const companyTicker = leftRow[0].split('**')[1] ? `(${leftRow[0].split('**')[1]})` : null;
                const toUrl = `/library/?searchType=company&searchVal=${encodeURIComponent(leftRow[0].split('**')[1])}&searchTicker=${encodeURIComponent(leftRow[0].split('**')[1])}`;
                return (
                  <div className={`aResultRow row-color-${(i % 2).toString()}`}>
                    <Container
                      className="company-name"
                      as={companyTicker ? NavLink : 'div'}
                      to={companyTicker ? toUrl : ''}
                    >
                      {companyName}
                    </Container>
                    <div className="cell-holders">
                      {
                        resultRight[i].slice(0, 4).map(r => <div className="cell">{r}</div>)
                      }
                    </div>
                  </div>
                );
              })
              :
              data && data.map((leftRow, i) => {
                return (
                  <div className={`aResultRow row-color-${(i % 2).toString()}`}>
                    <div
                      className="company-name"
                      role="button"
                      onKeyPress={() => {}}
                      tabIndex={0}
                      onClick={() => this.setModal(leftRow)}
                    >
                      {leftRow.CompanyName}
                    </div>
                    <div className="cell-holders">
                      <div className="cell">{leftRow.RatingDesc}</div>
                      <div className="cell">{leftRow.ClosingPrice}</div>
                      <div className="cell">{leftRow.TargetPrice}</div>
                      <div className="cell">{leftRow.TotalReturn}</div>
                    </div>
                  </div>
                );
              })
          }
        </div>
      );
      return (
        <div className="only-mobile">
          {headerSection}
          {bodySection}
        </div>
      );
    }
    return null;
  }
  sortTableBy = (type) => () => {
    if (!this.props.sortTableBy) {
      return;
    }
    let { sortOrder } = this.state;
    if (sortOrder === type) {
      this.props.sortTableBy(type, 'DESC');
      this.setState({ sortOrder: '' });
    } else {
      sortOrder = type;
      this.setState({ sortOrder });
      this.props.sortTableBy(type, 'ASC');
    }
  }
  tableRowCorrection = () => {
    const rowsRight = document.getElementsByClassName('result-section a-sliding-table-row-right');
    const rowsLeft = document.getElementsByClassName('result-section a-sliding-table-row-left');
    for (let i = 0; i < Math.min(rowsRight.length, rowsLeft.length); i += 1) {
      const heightRight = rowsRight[i].getBoundingClientRect().height;
      const heightLeft = rowsLeft[i].getBoundingClientRect().height;
      const maxPossibleHeight = heightRight < heightLeft ? heightLeft : heightRight;
      rowsRight[i].style.height = `${maxPossibleHeight}px`;
      rowsLeft[i].style.height = `${maxPossibleHeight}px`;
    }
  }
  componentDidUpdate() {
    this.tableRowCorrection();
  }
  componentDidMount() {
    this.tableRowCorrection();
    const tableHeader = document.getElementById('table-width-sliding');
    if (tableHeader) {
      this.setState({ wrapper1Width: tableHeader.getBoundingClientRect().width });//eslint-disable-line
    }
  }
  wrapper1Scroll = () => {
    const wrapper1 = document.getElementById('table-wrapper-1');
    const wrapper2 = document.getElementById('table-wrapper-2');
    wrapper2.scrollLeft = wrapper1.scrollLeft;
  }
  wrapper2Scroll = () => {
    const wrapper1 = document.getElementById('table-wrapper-1');
    const wrapper2 = document.getElementById('table-wrapper-2');
    wrapper1.scrollLeft = wrapper2.scrollLeft;
  }
  render() {
    const { filteredResultCount, resultLeft, headerRight, headerLeft, resultRight, isResultLoaded, miniSummary, fromStockScreener, sortClick } = this.props;
    const { sortOrder, wrapper1Width } = this.state;
    if (!isResultLoaded) return null;
    if (!(resultLeft && resultRight && resultRight.length && resultLeft.length)) {
      return <div className="filters-and-buttons">No results Found! Try resetting your Filters</div>;
    }
    const totalCount = (filteredResultCount || resultLeft.length);
    return (
      <div className="sliding-table">
        <div className="results only-desktop">
          {
            miniSummary ?
              <div className="mini-summary">{miniSummary}</div>
              : null
          }
          {
            (totalCount) > 1 && !miniSummary ?
              <div className="col-md-12 min-summary">
                {totalCount} Results Found
              </div>
              : null

          }
          {
            (totalCount) === 1 && !miniSummary ?
              <div className="col-md-12 min-summary">
                1 Result Found
              </div>
              : null
          }
          <div className="table-left">
            <div className="head-section" id={'sliding-table-content'}>
              {
                headerLeft.map(colVal => {
                  return (
                    <div className="header-cell">
                      <div className="cell" tabIndex={0} role={'button'} onKeyPress={() => {}} onClick={this.sortTableBy(colVal.key)}>
                        <span className="text">{colVal.text}</span>
                        <i aria-hidden="true" className={sortOrder === colVal.key ? 'caret up icon' : 'caret down icon'} title={`Sort by ${colVal.text}`} />
                      </div>
                    </div>
                  );
                })
              }
            </div>
            {!sortClick &&
              resultLeft.map((aResultRow, i) => {
                const aRow = aResultRow.map(colVal => {
                  const companyName = colVal.split('**')[0];
                  const companyTicker = colVal.split('**')[1] ? `(${colVal.split('**')[1]})` : null;
                  const toUrl = `/library/?searchType=company&searchVal=${encodeURIComponent(colVal.split('**')[1])}&searchTicker=${encodeURIComponent(colVal.split('**')[1])}`;
                  return (
                    !fromStockScreener ?
                      <div className="result-cell">
                        <Container
                          as={companyTicker ? NavLink : 'div'}
                          to={companyTicker ? toUrl : ''}
                        >
                          <span className="cell">{companyName}</span>
                        </Container>
                      </div>
                      :
                      <div className="result-cell">
                        <Container
                          as={companyTicker ? NavLink : 'div'}
                          to={companyTicker ? toUrl : ''}
                          onClick={() => this.props.handleGTM('companyClick', companyName, companyName)}
                        >
                          <span className="cell">
                            <span className="company-name">{companyName}</span>
                            <br />
                            <span className="company-ticker">{companyTicker}</span>
                          </span>
                        </Container>
                      </div>
                  );
                });
                return (
                  <div className={`result-section a-sliding-table-row-left row-color-${(i % 2).toString()}`}>
                    {aRow}
                  </div>
                );
              })
            }
          </div>
          <div className="wrapper1" id={'table-wrapper-1'} onScroll={this.wrapper1Scroll}>
            <div className="div1" style={{ width: `${wrapper1Width}px` }} />
          </div>

          <div className="table-right" id={'table-wrapper-2'} onScroll={this.wrapper2Scroll}>
            <div className="head-section" id={'table-width-sliding'}>
              {
                headerRight.map(x => {
                  return (
                    <div className="header-cell">
                      <div className="cell" tabIndex={0} role={'button'} onKeyPress={() => {}} onClick={this.sortTableBy(x.key)}>
                        <span className="text">{x.text}</span>
                        <i aria-hidden="true" className={sortOrder === x.key ? 'caret up icon' : 'caret down icon'} title={`Sort by ${x.text}`} />
                      </div>
                    </div>
                  );
                })
              }
            </div>
            {!sortClick &&
              resultRight.map((x, i) => {
                return (
                  <div className={`result-section a-sliding-table-row-right row-color-${(i % 2).toString()}`}>
                    {
                      x.map(y => {
                        return (<div className="result-cell">
                          <span className="cell">{y}</span>
                        </div>);
                      })
                    }
                  </div>
                );
              })
            }
            {
              sortClick && <div className="bmo-red-loader"><Loader active={true} content="Loading..." /></div>
            }
          </div>
        </div>
        {this.getMobileView()}
        {this.modalOpen()}
      </div>
    );
  }
}

export default SlidingTable;
