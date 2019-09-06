/* @flow weak */

/*
 * Component: ReportsResultCard
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { RichText, PublicationPreviewOverlay, PublicationMobilePreviewOverlay } from 'components';
import { Heading, Button, Popup } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
import st from 'constants/strings';

import {
  UPDATE_PROFILE_BOOKMARKS_DATA,
  REMOVE_PROFILE_BOOKMARKS_DATA,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ReportsResultCard.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ReportsResultCard extends Component {
  props: {
    data: {},
    isLoggedIn: bool,
    updateProfileBookmarksData: () => void,
    bookmarks: [],
    removeProfileBookmarksData: () => void,
    canBookmark: bool,
    publicationID: ''
  };

  static defaultProps = {
  };

  state = {
    previewIcon: 'eye-inactive',
    isOpen: false,
  };

  handleBookmarkClick = (publicationID, { name }, gtmData) => { // eslint-disable-line
    const { bookmarks, updateProfileBookmarksData, removeProfileBookmarksData } = this.props;
    pushToDataLayer('library', 'researchBookmarkClick', { label: (name || ''), data: gtmData });
    if (bookmarks.indexOf(publicationID) === -1) {
      updateProfileBookmarksData({ id: publicationID }, bookmarks);
    } else {
      removeProfileBookmarksData({ id: publicationID }, bookmarks);
    }
  }

  handleDownloadClick = (data) => {
    pushToDataLayer('databoutique', 'companyDataSetDownload', { label: data.name });
  }

  componentDidMount() {
    // Component ready
  }

  togglePreviewIcon = (popupState) => () => {
    if (popupState === 'open') {
      this.setState({ previewIcon: 'eye-active' });
    } else {
      this.setState({ previewIcon: 'eye-inactive' });
    }
  }

  opModal = () => {
    this.setState({ isOpen: true });
  }

  closeModal = () => {
    this.setState({ isOpen: false });
  }

  getAuthorGTMData = (name, d, analystData) => {
    let data = {};
    const { sectors, role } = analystData;
    if (d) {
      let sectorStr = '';
      if (sectors && sectors.length) {
        sectorStr = sectors.map(s => s.name).join(';');
      }
      data = {
        'Report Name': d.name || '',
        'Company Name': d.company ? d.company.name : '',
        'Report Category': d.template_name || '',
        'Report Date': d.publisher_date || '',
        'Report Country': d.company ? d.company.domicile_country : '',
        'BMO Analyst Name': name || '',
        'BMO Analyst Job Title': role || '',
        'Sector Name': sectorStr
      };
    }
    return data;
  }

  handlePublicationClick = (name, data) => {
    pushToDataLayer('strategy', 'strategyPublictaionClick', { label: name, data });
  }

  render() {
    const { data, isLoggedIn, bookmarks, canBookmark, publicationID } = this.props;
    const { previewIcon, isOpen } = this.state;
    const toLink = `/research/${data.product_id}/`;
    const gtmData = (this.getAuthorGTMData(((data.analysts && data.analysts.length) ? data.analysts[0].display_name : ''), data || [], ((data.analysts && data.analysts.length) ? data.analysts[0] : {})));

    return (
      <div className="reports-result-card">
        <div className="left">
          <div className="result-column date">
            {moment(data.publisher_date).format('MM/DD/YYYY') || ''}
          </div>
          <div className="result-column subject">
            <NavLink className={'subject-heading'} onClick={() => this.handlePublicationClick((!BMOmodel ? data.title : data.name), gtmData, BMOmodel)} to={toLink}>
              <RichText richText={data.title} />
            </NavLink>
            <Heading as={'span'} className={'subject-details'}>
              <RichText richText={data.bottom_line || data.key_points || ''} />
            </Heading>
          </div>
          <div className="result-column user-pref">
            <Popup
              className={'publication-preview-overlay'}
              trigger={<Button tabIndex={0} className={`user-pref-icon eye-icon ${previewIcon}`} title={st.previewIcon} />}
              content={<PublicationPreviewOverlay data={data} gtmData={gtmData} />}
              on={'click'}
              hideOnScroll={true}
              offset={-250}
              style={{ padding: '24px' }}
              position={'left center'}
              onOpen={this.togglePreviewIcon('open')}
              onUnmount={this.togglePreviewIcon('close')}
            />
            {
              isLoggedIn && canBookmark &&
              <Button
                tabIndex={0}
                title={st.bookmark}
                onClick={() => this.handleBookmarkClick(publicationID, data, gtmData)}
                className={`user-pref-icon bookmark-icon blue-bookmark bg-icon-props ${bookmarks.indexOf(publicationID) > -1 ? 'selected' : ''}`}
              />
            }
          </div>
        </div>
        <div className="right">
          <Button tabIndex={0} className={'linkBtn eye-inactive'} onClick={() => this.opModal()} />
          <PublicationMobilePreviewOverlay
            isLoggedIn={isLoggedIn}
            isOpen={isOpen}
            data={data}
            closeModal={() => this.closeModal()}
            bookmarks={bookmarks}
            canBookmark={canBookmark}
            handleBookmarkClick={() => this.handleBookmarkClick(data)}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateProfileBookmarksData: (data, allBookmarks) => {
    dispatch(UPDATE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
  removeProfileBookmarksData: (data) => {
    dispatch(REMOVE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
});

export default connect(null, mapDispatchToProps)(ReportsResultCard);
