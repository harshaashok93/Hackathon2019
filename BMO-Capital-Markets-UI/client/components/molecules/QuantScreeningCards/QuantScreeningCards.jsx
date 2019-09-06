/* @flow weak */

/*
 * Component: QuantScreeningCards
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Heading, List, Button } from 'unchained-ui-react';
import { PublicationCardSmall } from 'components';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QuantScreeningCards.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QuantScreeningCards extends Component {
  props: {
    title: '',
    reportData: [],
    bookmarks: [],
    isLoggedIn: bool,
    total: number,
    showMoreClick: () => void,
  };

  static defaultProps = {

  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const { title, reportData, bookmarks, isLoggedIn, total } = this.props;
    return (
      <div className="wrapper quant-screening-cards">
        {
          title ?
            <div>
              <span className="v-ln" />
              <Heading className="page-title" content={title} />
            </div>
            : null
        }
        <List className={'result-cards'}>
          {reportData && reportData.length === 0 ?
            <div className={'no-results-found'}>{'No Results Found'}</div>
            :
            <div>
              {
                reportData.map((data) => {
                  return (
                    <List.Item key={Math.random()}>
                      <PublicationCardSmall
                        bookmarks={bookmarks}
                        data={data}
                        isLoggedIn={isLoggedIn}
                        parentComponent={'Quantitative Page'}
                        localTitle={title}
                      />
                    </List.Item>
                  );
                })
              }
            </div>
          }
        </List>
        {reportData.length < total && <Button className={'linkBtn bmo_chevron bottom show-more'} content={'Show More'} onClick={() => this.props.showMoreClick()} />}
      </div>
    );
  }
}

export default QuantScreeningCards;
