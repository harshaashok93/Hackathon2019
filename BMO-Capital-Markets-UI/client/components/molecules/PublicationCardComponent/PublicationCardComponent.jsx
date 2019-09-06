/* @flow weak */

/*
 * Component: PublicationCardComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container } from 'unchained-ui-react';
import config from 'config';
import st from 'constants/strings';
import { LibrarySearchResultOverlay, RichText, CustomNavLink } from 'components';
import { toShowAnalyst } from 'utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './PublicationCardComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class PublicationCardComponent extends Component {
  props: {
    isLoggedIn: bool,
    bookmarks: [],
    data: {},
    bookmarkClick: () => void,
    canBookmark: bool,
    canAccessContent: bool,
  };

  static defaultProps = {
  };

  state = {
    isOpen: false
  }

  componentDidMount() {
    // Component ready
  }

  handleBookmarkClick = (data) => {
    this.props.bookmarkClick(data);
  }

  opModal = () => {
    this.setState({ isOpen: true });
  }

  closeModal = () => {
    this.setState({ isOpen: false });
    document.body.classList.remove('noscroll-login');
  }

  render() {
    const { data, isLoggedIn, bookmarks, canBookmark, canAccessContent } = this.props;
    const { isOpen } = this.state;
    const showAnalystInfo = (data.active === '1' || data.active === true) && toShowAnalyst(data) && (!data.do_not_sync_to_rds) && canAccessContent;

    return (
      <div className="publication-card-component">
        <div className={'videocast-info-card'}>
          <div className={'videocast-info'}>
            <div className={'date-name'}>
              <div className={'date'}>{data.publisherDate}</div>
              <div className={'ticker mobile-view'}>{data.ticker || ''}</div>
              <Container
                className={`name-and-pos ${showAnalystInfo ? '' : 'no-link'}`}
                as={showAnalystInfo ? NavLink : 'div'}
                to={(showAnalystInfo) ? `${config.analystURLPrefix}/${data.client_code}` : ''}
              >
                {`${data.analysts_name}${data.position ? ', ' : ''}${data.position}`}
              </Container>
            </div>
            <CustomNavLink
              to={data.historicalPdf ? '' : `/research/${data.productID}/`}
              isHistoricalPublication={data.historicalPdf}
              key={data._id || ''}
              radarLink={data.historicalPdf ? data.radarLink : ''}
              researchType={(data.tags && data.tags.research_type) || ''}
              rdsPubId={data.rds_pub_id || ''}
            >
              <div className={'publication-title'}>{data.title}
              </div>
            </CustomNavLink>
          </div>
          {isLoggedIn && canBookmark &&
            <div className={'book-mark'}>
              <Button
                className={`blue-bookmark ${bookmarks.indexOf(data.publicationID) > -1 ? 'selected' : ''}`}
                tabIndex={0}
                onClick={() => this.handleBookmarkClick(data)}
                title={st.bookmark}
              />
              <Button tabIndex={0} className={'linkBtn eye-inactive mobile-view'} onClick={() => this.opModal()} />
            </div>
          }
          {isOpen &&
            <LibrarySearchResultOverlay
              canAccessContent={canAccessContent}
              bookmarks={bookmarks}
              analystSource={[]}
              isOpen={isOpen}
              data={data}
              canBookmark={canBookmark}
              handleBookmarkClick={() => this.handleBookmarkClick(data)}
              closeModal={() => this.closeModal()}
            />
          }
        </div>
        {
          data.bottomLine ?
            <div className={'publication-description'}>
              <RichText richText={`${data.bottomLine.replace(/(<([^>]+)>)/ig, '').split(' ').splice(0, 20).join(' ')}`} />
              ...
              <CustomNavLink
                to={data.historicalPdf ? '' : `/research/${data.productID}/`}
                isHistoricalPublication={data.historicalPdf}
                key={data._id || ''}
                radarLink={data.historicalPdf ? data.radarLink : ''}
                researchType={(data.tags && data.tags.research_type) || ''}
                rdsPubId={data.rds_pub_id || ''}
              >
                (more)
              </CustomNavLink>
            </div>
            : null
        }
      </div>
    );
  }
}

export default PublicationCardComponent;
