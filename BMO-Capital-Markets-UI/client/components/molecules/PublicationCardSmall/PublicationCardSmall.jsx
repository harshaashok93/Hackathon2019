/* @flow weak */

/*
 * Component: PublicationCardSmall
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { Heading, Image, Button, Container } from 'unchained-ui-react';
import { TEAM_ICON, TEAM_ICON_FOCUSED, DEFAULT_PROFILE, tierImageMap } from 'constants/assets';
import { pushToDataLayer } from 'analytics';
import st from 'constants/strings';
import { toShowAnalyst, getTriangleImage } from 'utils';
import config from 'config';

import {
  userSelector, datepickerSelector
} from 'store/selectors';

import {
  SET_COMP_TICKER_FROM_DEPARTMENT,
  SET_SEARCH_TYPE,
  REMOVE_PROFILE_BOOKMARKS_DATA,
  UPDATE_PROFILE_BOOKMARKS_DATA,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { BmoPopUp, RetailConsumerTeamCard, LibrarySearchResultOverlay, DesktopCommentOverlay, RichText, CustomNavLink, CannabisPreviewModal } from 'components';
import './PublicationCardSmall.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class PublicationCardSmall extends Component {
  props: {
    data: {},
    isLoggedIn: Boolean,
    updateProfileBookmarksData: () => void,
    bookmarks: [],
    removeProfileBookmarksData: () => void,
    parentComponent: '',
    setSearchType: () => void,
    setCompanyTicker: () => void,
    profile: {},
    fromDate: '',
    toDate: '',
    localTitle: '',
    index: number
  };

  static defaultProps = {
    data: {}
  };

  state = {
    isRetailConsumerOpen: false,
    isOpen: false,
    teamIcon: TEAM_ICON,
    previewIcon: 'eye-inactive',
    isCannabis: false,
  }

  bluredSubjectImageSrc = '';

  opModal = (type) => {
    this.setState({ isOpen: true, isCannabis: (type === 'cannabis') });
  }

  closeModal = () => {
    this.setState({ isOpen: false, isCannabis: false });
  }

  openRetailConsumer = () => {
    const isRetailConsumerOpen = !this.state.isRetailConsumerOpen;
    this.setState({ isRetailConsumerOpen });
  }

  toggleTeamIcon = (popupState) => () => {
    if (popupState === 'open') {
      this.setState({ teamIcon: TEAM_ICON_FOCUSED });
    } else {
      this.setState({ teamIcon: TEAM_ICON });
    }
  }
  togglePreviewIcon = (popupState, data, gtmData) => () => {
    if (popupState === 'open') {
      const { parentComponent, localTitle } = this.props;
      if (parentComponent === 'Quantitative Page' && this.state.previewIcon === 'eye-inactive') {
        pushToDataLayer('quant', 'tipsPreviewClick', { action: 'Preview', label: (`${localTitle}: ${data.title}` || ''), data: gtmData });
      } else if ((parentComponent === 'Strategy' || parentComponent === 'Strategy Reports') && this.state.previewIcon === 'eye-inactive') {
        pushToDataLayer('library', 'researchPreviewClick', { category: 'Strategy', action: 'Research Preview', label: data.title, data: gtmData });
      }
      this.setState({ previewIcon: 'eye-active' });
    } else {
      this.setState({ previewIcon: 'eye-inactive' });
    }
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
        'Report Name': d.title || '',
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

  componentWillMount() {
    const blurImageList = (window.unchainedSite && window.unchainedSite.BlurredImage && window.unchainedSite.BlurredImage.library_subject_images) || [];
    const randomNumber = Math.floor(Math.random() * ((blurImageList && blurImageList.length) || 1));
    this.bluredSubjectImageSrc = blurImageList[randomNumber];
  }

  componentWillUnmount() {
    this.bluredSubjectImageSrc = '';
  }

  handleAuthorClick = (name, data) => {
    pushToDataLayer('library', 'analystPicClick', { label: name, data });
  }

  handleBookmarkClick = (data, gtmData) => {
    const { bookmarks, parentComponent, fromDate, toDate, localTitle } = this.props;
    if (parentComponent === 'profile-bookmarks') {
      pushToDataLayer('profile', 'researchBookmarkClick', { label: (data.title || ''), data: gtmData });
    } else if (parentComponent === 'Quantitative Page') {
      pushToDataLayer('quant', 'tipsBookmarkClick', { action: 'Bookmark', label: (`${localTitle}: ${data.title}` || ''), data: gtmData });
    } else if (parentComponent === 'Strategy' || parentComponent === 'Strategy Reports') {
      pushToDataLayer('library', 'researchBookmarkClick', { category: 'Strategy', label: (data.title || ''), data: gtmData });
    } else {
      pushToDataLayer('library', 'researchBookmarkClick', { label: (data.title || ''), data: gtmData });
    }
    if (bookmarks.indexOf(data.publicationID) === -1) {
      this.props.updateProfileBookmarksData({ id: data.publicationID, event_date__gte: fromDate, event_date__lte: toDate }, bookmarks);
    } else {
      this.props.removeProfileBookmarksData({ id: data.publicationID, event_date__gte: fromDate, event_date__lte: toDate }, bookmarks);
    }
  }

  handlePublicationClick = (name, data, type) => {
    const { parentComponent, localTitle } = this.props;
    if (parentComponent === 'profile-bookmarks') {
      pushToDataLayer('profile', 'researchPublicationClick', { label: name, data });
    } else if (parentComponent === 'Quantitative Page') {
      pushToDataLayer('quant', 'tipsPublicationLinkClick', { action: (type || ''), label: (` ${localTitle}: ${name}` || ''), data });
    } else if (parentComponent === 'Strategy' || parentComponent === 'Strategy Reports') {
      pushToDataLayer('library', 'researchPublictaionClick', { category: 'Strategy', action: 'Open Research', label: name, data });
    } else if (parentComponent === 'Related Content') {
      pushToDataLayer('library', 'researchPublictaionClick', { category: 'Report', action: 'Open - Related', label: name, data });
    } else {
      pushToDataLayer('library', 'researchPublictaionClick', { label: name, data });
    }
  }

  handleCompanyTickerClick = (type, displayValue, symbol) => {
    if (displayValue && type && symbol) {
      this.props.setSearchType({ type, displayValue, value: { displayValue }, symbol });
    }
    if (type === 'company') {
      this.props.setCompanyTicker(displayValue);
    }
  }

  renderVideocast = (publicationData, message, isLoggedIn) => {
    if (!publicationData.canAccessPublication && isLoggedIn) {
      return (
        <div className={'videocast-play-icon grey-icon'}>
          <Button secondary className={'play-icon'}>{'Play Video'}
            <BmoPopUp
              debug={false}
              showOnClick={false}
              showInToggleMode={true}
              rightPosBuff={30}
              hideController={'hover'}
              direction="horizontal-mid"
              strictDirection="left"
              leftBuff={20}
              topBuff={20}
            >
              <CannabisPreviewModal message={(message === '' && (!isLoggedIn)) ? publicationData.cannabis_message : message} />
            </BmoPopUp>
          </Button>
        </div>
      );
    }
    return (
      <CustomNavLink
        to={`/research/${publicationData.productID}/`}
        isHistoricalPublication={publicationData.historicalPdf}
        radarLink={publicationData.radarLink}
        researchType={publicationData.researchType}
        rdsPubId={publicationData.rdsPubId}
      >
        <div className={'videocast-play-icon'}>
          <Button secondary className={'play-icon'}>{'Play Video'}</Button>
        </div>
      </CustomNavLink>
    );
  }

  renderConsumerPopUp = (src, publicationData, canAccessContent, gtmData, profile, index) => {
    const { isRetailConsumerOpen } = this.state;
    const displayAnalyst = publicationData.display_analyst;
    const analystList = src.analysts.filter(data => toShowAnalyst(data) === true);
    const analystName = publicationData.analysts_last_name || publicationData.analysts_name;
    const showAnalystInfo = (displayAnalyst.active === '1' || displayAnalyst.active === true) && toShowAnalyst(displayAnalyst) && canAccessContent && (!displayAnalyst.do_not_sync_to_rds);
    return (
      <div className={`analyst-or-team ${analystList.length === 0 ? 'nohover' : ''}`}>
        <Container
          as={showAnalystInfo ? NavLink : 'div'}
          to={(showAnalystInfo) ? `${config.analystURLPrefix}/${displayAnalyst.client_code}` : ''}
          className={'analysts-name bmopopup-analyst-hover'}
        >
          <Image shape={'circular'} alt={`${publicationData.analysts_name} avatar`} src={publicationData.primaryAnalystOverride.avatar_url || publicationData.analysts_avatar || DEFAULT_PROFILE.img} className={'author-profile-pic'} />
          <div className={'author-name'} id={index === 0 ? 'first-author-intro-id' : ''}>{analystName} </div>
          <Container className={'mobile-view-author-name'}>
            <div className={'mobile-author-name'}>{analystName} </div>
          </Container>
        </Container>
        {analystList.length ?
          <BmoPopUp
            minHeight={300}
            direction="horizontal-mid"
            rightPosBuff={25}
            leftPosBuff={30}
            hideController={'hover'}
            actLeftBuff={100}
            leftBuff={15}
            keyID={index}
            hideOnScroll={false}
          >
            <RetailConsumerTeamCard
              team={false}
              canAccessContent={canAccessContent}
              isOpen={isRetailConsumerOpen}
              gtmData={gtmData}
              data={src.analysts || []}
              canFollow={canAccessContent && profile && profile.can_follow_content}
            />
          </BmoPopUp>
          :
          null
        }
      </div>
    );
  }

  renderUserPreferenceIcon = (publicationData, gtmData, canAccessBookmark, canAccessContent, src, previewData, message, triangleImage) => {
    const { previewIcon } = this.state;
    const { isLoggedIn, bookmarks, profile, index } = this.props;

    if (!publicationData.canAccessPublication && isLoggedIn) {
      if (publicationData.isPublic) {
        return (
          <div className="result-column user-pref">
            {this.renderVideoPodIcon(publicationData.researchType)}
            {this.renderBMOTriangle(triangleImage)}
            {this.renderPDFIcon(publicationData, gtmData)}
            {this.renderEyeIcon(publicationData, isLoggedIn, canAccessBookmark, previewIcon, gtmData, canAccessContent, src, previewData, profile)}
            {this.renderBookmarkIcon(isLoggedIn, canAccessBookmark, publicationData, gtmData, bookmarks, index)}
          </div>
        );
      }
      return (
        <div className="result-column user-pref">
          {this.renderVideoPodIcon(publicationData.researchType)}
          {this.renderBMOTriangle(triangleImage)}
          {this.renderPDFIcon(publicationData, gtmData)}
          {this.renderLockIcon(isLoggedIn, publicationData, message, isLoggedIn ? 'brand-icon-shift-left shift-left-lockicon' : '')}
        </div>
      );
    } else if (!isLoggedIn && src.cannabis) {
      return (
        <div className="result-column user-pref">
          {this.renderVideoPodIcon(publicationData.researchType)}
          {this.renderBMOTriangle(triangleImage)}
          {this.renderPDFIcon(publicationData, gtmData)}
          {publicationData.isPublic ?
            this.renderEyeIcon(publicationData, isLoggedIn, canAccessBookmark, previewIcon, gtmData, canAccessContent, src, previewData, profile)
            :
            this.renderLockIcon(isLoggedIn, publicationData, message, isLoggedIn ? 'brand-icon-shift-left' : 'lock-icon-shift-left')
          }
        </div>
      );
    }
    return (
      <div className="result-column user-pref">
        {this.renderVideoPodIcon(publicationData.researchType)}
        {this.renderBMOTriangle(triangleImage)}
        {this.renderPDFIcon(publicationData, gtmData)}
        {this.renderEyeIcon(publicationData, isLoggedIn, canAccessBookmark, previewIcon, gtmData, canAccessContent, src, previewData, profile)}
        {this.renderBookmarkIcon(isLoggedIn, canAccessBookmark, publicationData, gtmData, bookmarks, index)}
      </div>
    );
  }

  renderMobilePreviewIcon = (isLoggedIn, src) => {
    if (!isLoggedIn && src.cannabis) {
      return (
        <Button tabIndex={0} className={'user-pref-icon lock-icon'} onClick={() => this.opModal('cannabis')} />
      );
    }
    return (
      <Button tabIndex={0} className={'linkBtn eye-inactive'} onClick={() => this.opModal('non-cannabis')} />
    );
  }

  renderSubject = (publicationData, description, moreText, src) => {
    const { isLoggedIn } = this.props;
    const showBlur = (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.SHOW_BLUR_SUBJECT) || 'false';
    const subjectText = (
      <Heading as={'span'} className={'subject-details'}>
        <RichText richText={`${description}${moreText}`} />
      </Heading>
    );

    const blurredImage = (<Image className={'subject-blurred-image'} src={this.bluredSubjectImageSrc} />);

    if (publicationData.isPublic) {
      return subjectText;
    }

    if (!isLoggedIn) {
      if (src.cannabis) {
        if (showBlur.toLowerCase() === 'true') {
          return blurredImage;
        }
      }
      return subjectText;
    } else if (isLoggedIn) {
      if (!publicationData.canAccessPublication && (showBlur.toLowerCase() === 'true')) {
        return blurredImage;
      } else if (publicationData.canAccessPublication) {
        return subjectText;
      }
    }
    return null;
  }

  renderVideoPodIcon = (researchType) => {
    if (researchType === 'Videocast' || researchType === 'Podcast') {
      return <div className={`${researchType} g user-pref-icon`} title={researchType} />;
    }
    return null;
  }

  renderBMOTriangle = (triangleImage) => {
    if (!triangleImage) return null;

    return (
      <div className={'triangle-image'}>
        <Image alt={'Brand-triangle'} src={tierImageMap[triangleImage[0]]} title={triangleImage[1]} className={'brand-triangle-licon'} />
        <div className={'brand-text'}>{triangleImage[1]}</div>
      </div>
    );
  }

  renderLockIcon = (isLoggedIn, publicationData, message, classname) => {
    return (
      <Button tabIndex={0} className={`user-pref-icon ${classname} lock-icon`}>
        <BmoPopUp
          debug={false}
          showOnClick={false}
          showInToggleMode={true}
          rightPosBuff={30}
          hideController={'hover'}
          direction="horizontal-mid"
          strictDirection="left"
          leftBuff={20}
          topBuff={20}
        >
          <CannabisPreviewModal message={(message === '' && (!isLoggedIn)) ? publicationData.cannabis_message : message} />
        </BmoPopUp>
      </Button>
    );
  }

  renderPDFIcon = (publicationData, gtmData) => {
    if (!publicationData.historicalPdf) return null;
    return (
      <CustomNavLink
        className="pdf-icon"
        onClick={() => this.handlePublicationClick(publicationData.title, gtmData, 'PDF Download')}
        isHistoricalPublication={true}
        radarLink={publicationData.radarLink}
        key={publicationData.publicationID}
        researchType={publicationData.researchType}
        rdsPubId={publicationData.rdsPubId}
      >
        {publicationData.researchType !== 'Videocast' ?
          <div>
            <div className="pdf-image g user-pref-icon" title={st.publicationPDF} />
          </div>
          :
          null
        }
        <div className={'pdf-size'} />
      </CustomNavLink>
    );
  }

  renderEyeIcon = (publicationData, isLoggedIn, canAccessBookmark, previewIcon, gtmData, canAccessContent, src, previewData, profile) => {
    return (
      <Button tabIndex={0} className={`eye-close-button user-pref-icon ${(isLoggedIn && (!canAccessBookmark)) && 'brand-icon-shift-left'} eye-icon ${previewIcon} ${!canAccessBookmark ? 'shift-right' : ''}`} title={st.previewIcon} >
        <BmoPopUp
          showOnClick={true}
          rightBuff={30}
          showInToggleMode={true}
          hideController={'click'}
          direction="horizontal-mid"
          rightPosBuff={25}
          leftPosBuff={25}
          onUnMount={this.togglePreviewIcon('close')}
          onMount={this.togglePreviewIcon('open', publicationData, gtmData)}
          strictDirection="left"
          classSelector="eye-close-button"
        >
          <DesktopCommentOverlay
            canAccessContent={canAccessContent}
            analystSource={src.analysts || []}
            data={publicationData}
            gtmData={gtmData}
            previewData={previewData}
            canFollow={profile && profile.can_follow_content}
          />
        </BmoPopUp>
      </Button>
    );
  }

  renderBookmarkIcon = (isLoggedIn, canAccessBookmark, publicationData, gtmData, bookmarks, index) => {
    if (!isLoggedIn) return null;
    if (!canAccessBookmark) return null;
    return (
      <Button
        tabIndex={0}
        onClick={() => this.handleBookmarkClick(publicationData, gtmData)}
        className={`user-pref-icon bookmark-icon blue-bookmark bg-icon-props ${bookmarks.indexOf(publicationData.publicationID) > -1 ? 'selected' : ''}`}
        title={st.bookmark}
        id={index === 1 ? 'first-bookmark-intro-id' : ''}
      />
    );
  }

  renderMobileViewIcon = (publicationData, isLoggedIn, src) => {
    if (publicationData.isPublic) {
      return <Button tabIndex={0} className={'linkBtn eye-inactive'} onClick={() => this.opModal('non-cannabis')} />;
    }

    if ((!publicationData.canAccessPublication && isLoggedIn) || (!isLoggedIn && src.cannabis)) {
      return <Button tabIndex={0} className={'user-pref-icon lock-icon'} onClick={() => this.opModal('cannabis')} />;
    }

    return <Button tabIndex={0} className={'linkBtn eye-inactive'} onClick={() => this.opModal('non-cannabis')} />;
  }

  render() {
    const { data, isLoggedIn, bookmarks, profile, index } = this.props;
    const src = data._source;
    const analyst = src.analysts && src.analysts.length ? src.analysts[0] : {};
    let publisherDate = moment(src.publisher_date).format('MM/DD/YYYY');

    const isToday = moment(moment().format('MM/DD/YYYY')).diff(publisherDate);
    if (isToday === 0) {
      publisherDate = moment(src.publisher_date).format('HH:mm');
    }

    const publicationData = {
      publicationID: (data._id || ''),
      corpDebt: (src.corp_debt || false),
      equity: (src.equity || false),
      display_analyst: (analyst || {}),
      analysts_avatar: ((analyst && analyst.avatar_url) || ''),
      analysts_name: ((analyst && analyst.display_name) || ''),
      analysts_last_name: ((analyst && analyst.last_name) || ''),
      analyst_code: ((analyst && analyst.client_code) || ''),
      analyst_display_title: ((analyst && analyst.display_title) || ''),
      analyst_division_name: ((analyst && analyst.division_name) || ''),
      position: ((analyst && analyst.position) || ''),
      email: ((analyst && analyst.email) || ''),
      phone: ((analyst && analyst.phone) || ''),
      company: ((analyst && analyst.company) || ''),
      designation: ((analyst && analyst.designation) || ''),
      publisherDate,
      title: `${src.title || ''}`,
      researchType: (src.tags && src.tags.research_type ? `${(src.tags.research_type.charAt(0).toUpperCase() + src.tags.research_type.slice(1))}` : ''),
      subject: (src.bottom_line || src.key_points || ''),
      ticker: (src.company ? src.company.ticker : ''),
      keyPointsDetails: (src.key_points || ''),
      bottomLineDetails: (src.bottom_line || ''),
      productID: src.product_id,
      person_id: ((analyst && analyst.person_id) || ''),
      historicalPdf: src.historical_publication,
      radarLink: src.radar_link,
      active: ((analyst && analyst.active) || false),
      role: ((analyst && analyst.role) || ''),
      isCompanyActive: (src.company && src.company.active),
      isCompanyHide: (src.company && src.company.hide),
      summary: (src.summary || ''),
      body: (src.body || ''),
      doNotSyncToRds: ((analyst && analyst.do_not_sync_to_rds) || false),
      roles: ((analyst && analyst.roles) || []),
      client_code: ((analyst && analyst.client_code) || ''),
      primaryAnalystOverride: ((src.company && src.company.primary_analyst_override) || {}),
      rdsPubId: (src.rds_pub_id || ''),
      canAccessPublication: (src.can_access_publication || false),
      entitlement_preview_message: (src.entitlement_preview_message || ''),
      cannabis_message: (src.cannabis_message || ''),
      isPublic: (typeof src.is_public === 'boolean' ? src.is_public : false)
    };

    const tierMap = {
      tier1: src.tier_1 || false,
      tier2: src.tier_2 || false,
      tier3: src.tier_3 || false,
    };

    const triangleImage = getTriangleImage(tierMap);

    const previewData = {
      heading: '',
      description: ''
    };
    if (publicationData.bottomLineDetails) {
      previewData.heading = 'Bottom Line';
      previewData.description = publicationData.bottomLineDetails.replace(/(<([^>]+)>)/ig, '').split(' ').splice(0, 50).join(' ');
    } else if (publicationData.keyPointsDetails) {
      previewData.heading = 'Key Points';
      previewData.description = publicationData.keyPointsDetails.replace(/(<([^>]+)>)/ig, '').split(' ').splice(0, 50).join(' ');
    } else if (publicationData.summary) {
      previewData.description = publicationData.summary.replace(/(<([^>]+)>)/ig, '').split(' ').splice(0, 50).join(' ');
    } else if (publicationData.body) {
      previewData.description = publicationData.body.replace(/(<([^>]+)>)/ig, '').split(' ').splice(0, 50).join(' ');
    }
    if ((previewData.description && previewData.description.toLowerCase().trim()) === 'none') {
      previewData.description = '';
    }

    const { isOpen, isCannabis } = this.state;
    const gtmData = this.getAuthorGTMData(publicationData.analysts_name, src, analyst);
    let ticker = '';
    let displayTickerValue = '';
    let encodedSectorId = '';
    let displayCompanyName = '';
    if (src.company && src.company.ticker) {
      ticker = src.company.ticker;
      displayCompanyName = (src.company.name || '');
    } else if (src.sector_display_override && src.sector_display_override.symbol) {
      ticker = src.sector_display_override.symbol;
      displayCompanyName = (src.sector_display_override.name || '');
      encodedSectorId = encodeURIComponent(src.sector_display_override.bm_sector_id || '');
    } else if (src.sector && src.sector.symbol) {
      encodedSectorId = encodeURIComponent(src.sector.bm_sector_id || '');
      ticker = src.sector.symbol;
      displayCompanyName = (src.sector.name || '');
    }
    displayTickerValue = ticker;
    const type = (src.company && Object.keys(src.company).length ? 'company' : 'industry');
    const encodedTicker = encodeURIComponent(ticker);
    const encodedTickerName = encodeURIComponent(displayTickerValue);
    const redirectURL = (src.company && Object.keys(src.company).length ? `/library/?searchType=company&searchVal=${encodedTicker}&searchTicker=${encodedTicker}&symbol=false` : `/library/?searchType=industry&searchVal=${encodedTickerName}&symbol=true&sectorId=${encodedSectorId}`);
    const canAccessContent = isLoggedIn && profile.can_access_content; // eslint-disable-line
    let description = '';
    let moreText = '';

    description = previewData.description;
    if (description.length > 140) {
      moreText = '...';
    }
    description = description.replace(/(<([^>]+)>)/ig, '').split(' ').splice(0, 20).join(' ');

    let researchTypeData = `(${publicationData.researchType})`;
    if (window.unchainedSite && window.unchainedSite.sitename === 'Corp' && publicationData.equity) {
      researchTypeData = `(Equity ${publicationData.researchType})`;
    }

    let companyActive = false;
    if (publicationData.isCompanyActive && !publicationData.isCompanyHide && window.unchainedSite && window.unchainedSite.sitename === 'Equity' && !src.company.corp_debt) {
      companyActive = true;
    } else if (publicationData.isCompanyActive && !publicationData.isCompanyHide && window.unchainedSite && window.unchainedSite.sitename === 'Corp' && src.company.corp_debt) {
      companyActive = true;
    }

    const message = publicationData.entitlement_preview_message;

    const canAccessBookmark = canAccessContent && (profile && profile.can_bookmark_content);

    return (
      <div className="publication-card-small">
        <div className="left">
          <div className="result-column date">
            {publicationData.publisherDate}
          </div>
          <div className="result-column author">
            {src.analysts ?
              this.renderConsumerPopUp(src, publicationData, canAccessContent, gtmData, profile, index)
              :
              null
            }
          </div>
          {src.company && Object.keys(src.company).length ?
            <Container
              id={index === 1 ? 'first-ticker-intro-id' : ''}
              className={'result-column ticker linkBtn'}
              as={companyActive ? NavLink : 'div'}
              to={companyActive ? redirectURL : ''}
              title={displayCompanyName}
              onClick={companyActive ? () => this.handleCompanyTickerClick(type, displayTickerValue, false) : () => {}}
            >
              {ticker}
            </Container>
            :
            <Container
              className={'result-column ticker linkBtn'}
              as={NavLink}
              to={redirectURL}
              title={displayCompanyName}
              onClick={() => this.handleCompanyTickerClick(type, (src.sector && src.sector.symbol) || '', true)}
            >
              <span id={index === 1 ? 'first-ticker-intro-id' : ''}>{ticker}</span>
            </Container>
          }
          {triangleImage ?
            <div className={'result-column triangle-mobile'}>
              <Image alt={'Brand-triangle'} src={tierImageMap[triangleImage[0]]} className={'brand-triangle-licon'} />
            </div>
            :
            null
          }
          <div className={`result-column subject ${publicationData.researchType === 'Videocast' ? 'videocasts' : ''}`}>
            <CustomNavLink
              className={'subject-heading'}
              onClick={() => this.handlePublicationClick(publicationData.title, gtmData, '')}
              to={publicationData.historicalPdf ? '' : `/research/${publicationData.productID}/`}
              isHistoricalPublication={publicationData.historicalPdf}
              radarLink={publicationData.historicalPdf ? publicationData.radarLink : ''}
              key={publicationData.publicationID}
              researchType={publicationData.researchType}
              rdsPubId={publicationData.rdsPubId}
            >
              <RichText
                richText={`${displayCompanyName}${displayCompanyName ? ':' : ''} ${publicationData.title}<span class={'research-type'}>${researchTypeData}</span>`}
              />
            </CustomNavLink>
            {this.renderSubject(publicationData, description, moreText, src)}
          </div>

          {this.renderUserPreferenceIcon(publicationData, gtmData, canAccessBookmark, canAccessContent, src, previewData, message, triangleImage)}

        </div>
        <div className="right">
          {this.renderMobileViewIcon(publicationData, isLoggedIn, src)}
        </div>
        <LibrarySearchResultOverlay
          canAccessContent={canAccessContent}
          bookmarks={bookmarks}
          analystSource={src.analysts || []}
          isOpen={isOpen}
          message={(message === '' && (!isLoggedIn)) ? publicationData.cannabis_message : message}
          isCannabis={isCannabis}
          isNotLibrary={false}
          data={publicationData}
          canBookmark={profile && profile.can_bookmark_content}
          handleBookmarkClick={() => this.handleBookmarkClick(publicationData, gtmData)}
          closeModal={() => this.closeModal()}
          triangleImage={triangleImage}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: userSelector.getUserProfileInfo(state),
  fromDate: datepickerSelector.getFromDate(state),
  toDate: datepickerSelector.getToDate(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateProfileBookmarksData: (data, allBookmarks) => {
    dispatch(UPDATE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
  removeProfileBookmarksData: (data, allBookmarks) => {
    dispatch(REMOVE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
  setSearchType: (data) => dispatch({ type: SET_SEARCH_TYPE, data }),
  setCompanyTicker: (data) => {
    dispatch({ type: SET_COMP_TICKER_FROM_DEPARTMENT, data });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PublicationCardSmall);
