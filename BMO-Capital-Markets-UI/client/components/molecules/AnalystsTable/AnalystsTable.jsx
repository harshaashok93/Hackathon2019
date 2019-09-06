/* @flow weak */

/*
 * Component: AnalystsTable
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container } from 'unchained-ui-react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AnalystsTable.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AnalystsTable extends Component {
  props: {
    headerRight: [],
    resultRight: [[], []],
    isResultLoaded: boolean,
    handleGTM: () => void,
  };

  render() {
    const { headerRight, resultRight, isResultLoaded, handleGTM } = this.props;
    if (!isResultLoaded) return null;
    if (!(resultRight && resultRight.length)) {
      return <div className="filters-and-buttons">No results Found! Try resetting your Filters</div>;
    }
    return (
      <div className="analysts-sliding-table">
        <div className="results only-desktop">
          <div className="table-right">
            <div className="head-section">
              {
                headerRight.map((x, i) => <div className={`header-cell ${i !== 0 ? 'hide-mobile' : 'first-cell'}`}><span className="cell">{x}</span></div>)
              }
            </div>
            {
              resultRight.map((x, i) => {
                return (
                  <div className={`result-section row-color-${(i % 2).toString()}`}>
                    {
                      x.map((y, j) => {
                        const compSplitArray = x[0].split(';');
                        const companyName = compSplitArray[0];
                        const companyTicker = compSplitArray[1];
                        const companyFinancialYear = compSplitArray[2];
                        const toUrl = `/library/?searchType=company&searchVal=${encodeURIComponent(companyTicker)}&searchTicker=${encodeURIComponent(companyTicker)}`;
                        return (
                          <div className={`result-cell ${j !== 0 ? 'hide-mobile' : 'first-cell'}`}>
                            {j === 0 ?
                              <Container
                                as={companyTicker ? NavLink : 'div'}
                                to={companyTicker ? toUrl : ''}
                                onClick={() => handleGTM(y || '')}
                              >
                                <span className="cell">{companyName}</span>
                                <span className="cell financial-year">{companyFinancialYear}</span>
                              </Container>
                              :
                              <span className="cell">{y}</span>
                            }
                          </div>
                        );
                      })
                    }
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default AnalystsTable;
