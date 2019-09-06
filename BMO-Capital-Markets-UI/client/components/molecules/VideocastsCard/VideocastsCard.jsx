/* @flow weak */

/*
 * Component: VideocastsCard
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Container } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import config from 'config';
import st from 'constants/strings';
import { toShowAnalyst } from 'utils';
import { CustomNavLink } from 'components';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './VideocastsCard.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class VideocastsCard extends Component {
  props: {
    isLoggedIn: bool,
    bookmarks: [],
    data: {},
    bookmarkClick: () => void,
    canBookmark: bool,
    profile: {}
  };

  static defaultProps = {
  };

  handleBookmarkClick = (data) => {
    this.props.bookmarkClick(data);
  }

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const { bookmarks, data, isLoggedIn, canBookmark, profile } = this.props;
    const canAccessContent = isLoggedIn && profile.can_access_content;
    const showAnalystInfo = (data.active === '1' || data.active === true) && toShowAnalyst(data) && (!data.do_not_sync_to_rds) && canAccessContent;
    return (
      <div className="videocasts-card">
        <div className={'videocast-info-card'}>
          <div className={'videocast-info'}>
            <div className={'date-name'}>
              <div className={'date'}>{moment(data.date).format('MM/DD/YYYY')}</div>
              <Container
                className={`name-and-pos ${showAnalystInfo ? '' : 'no-link'}`}
                as={showAnalystInfo ? NavLink : 'div'}
                to={(showAnalystInfo) ? `${config.analystURLPrefix}/${data.client_code}` : ''}
              >
                {`${data.name}${data.position ? ', ' : ''}${data.position}`}
              </Container>
            </div>
            <CustomNavLink
              to={data.historicalPdf ? '' : `/research/${data.playId}/`}
              isHistoricalPublication={data.historicalPublication}
              key={data.publicationID || ''}
              radarLink={data.historicalPublication ? data.radarLink : ''}
              researchType={'Videocast'}
              rdsPubId={data.rdsPubId || ''}
            >
              <div className={'videocast-link'}>{`Videocast: ${data.title}`}</div>
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
            </div>
          }
        </div>
        <CustomNavLink
          to={data.historicalPdf ? '' : `/research/${data.playId}/`}
          isHistoricalPublication={data.historicalPublication}
          key={data.publicationID || ''}
          radarLink={data.historicalPublication ? data.radarLink : ''}
          researchType={'Videocast'}
          rdsPubId={data.rdsPubId || ''}
        >
          <Button secondary className={'play-icon'}>{'Play Video'}</Button>
        </CustomNavLink>
      </div>
    );
  }
}

export default VideocastsCard;
