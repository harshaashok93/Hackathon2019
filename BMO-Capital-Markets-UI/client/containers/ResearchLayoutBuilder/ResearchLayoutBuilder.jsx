/* @flow weak */

/*
 * Component: ResearchLayoutBuilder
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StaticContentContainer } from 'containers';
import { VideocastDetailsListing, FourZeroFour } from 'components';
import { Grid, Message, Loader, Image, Button, Divider } from 'unchained-ui-react';
import { withRouter } from 'react-router';
import { RESEARCH_LAYOUT_PIXELATED_IMAGE, tierImageMap } from 'constants/assets';
import { getTriangleImage } from 'utils';
import { appsettingsVariable } from 'constants/UnchainedVariable';

import {
  GET_RESEARCH_LAYOUT_DATA,
  USER_AUTH_SIGN_IN_CLICKED,
  CLEAR_ERROR_MESSAGE,
  SET_RESEARCH_LAYOUT_DATA,
  SHOW_LOGIN_MODEL
} from 'store/actions';

import {
  researchSelector,
  userSelector,
} from 'store/selectors';

import { pushToPageDataLayer } from 'analytics';
import Components from './components';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ResearchLayoutBuilder.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ResearchLayoutBuilder extends Component {
  props: {
    match: {
      params: {
        pid: ''
      }
    },
    onSignInClick: () => void,
    getResearchLayoutData: () => void,
    isLoading: bool,
    researchLayoutData: {
      rawData: {},
      type: ''
    },
    isAuthenticated: boolean,
    bookmarks: [],
    profile: {},
    resetResearchLayoutData: () => void,
    isPrivateView: boolean,
    hideLoginModal: () => void,
  };

  state = {
    searchTerm: '',
    message: '',
    showMoreIndex: 1,
    messageModalOpen: true,
    accessTrialContent: false,
    bluredSubjectImageSrc: '',
    componentAccordionStatus: [],
    mobileShowMoreCards: false
  };

  static defaultProps = {
  }

  setPageTitle(props = this.props) {
    const { researchLayoutData } = props;
    if (researchLayoutData && researchLayoutData._source && researchLayoutData._source.MainContent && researchLayoutData._source.MainContent.title) {
      document.title = researchLayoutData._source.MainContent.title;
    } else if (researchLayoutData && researchLayoutData._source && researchLayoutData._source.ResearchTitle && researchLayoutData._source.ResearchTitle.Title) {
      document.title = researchLayoutData._source.ResearchTitle.Title;
    } else if (researchLayoutData && researchLayoutData.type === 'videocast' && researchLayoutData._source) {
      document.title = researchLayoutData._source.title;
    } else {
      document.title = 'BMO Capital Markets';
    }
  }

  componentWillReceiveProps(nextProps) {
    const { researchLayoutData, isPrivateView, isAuthenticated, hideLoginModal } = nextProps;
    const componentAccordionStatus = [];

    if (this.props.isAuthenticated !== null && ((nextProps.match.params.pid !== this.props.match.params.pid) ||
      (isAuthenticated !== this.props.isAuthenticated))) {
      this.props.getResearchLayoutData(nextProps.match.params.pid);
    }

    if (isPrivateView) {
      const overlayMessage = (appsettingsVariable.LOGIN_TO_VIEW_CONTENT_LOGIN_OVERLAY_MESSAGE || 'Welcome. Please log in or register to view this content.');
      this.dispatchLoginAction(overlayMessage);
    } else {
      hideLoginModal();
    }

    this.setPageTitle(nextProps);

    if (researchLayoutData && researchLayoutData.rawData && (researchLayoutData.rawData !== this.props.researchLayoutData.rawData)) {
      const data = researchLayoutData.rawData;
      const obj = {
        data: {
          reportCategory: data.category,
          reportDate: data.date,
          reportName: data.name,
          reportAuthor: data.authors,
          reportCompany: data.company,
          reportCountry: data.country,
          reportSector: data.sector,
          reportGroup: data.reportGroup,
          reportAttachments: data.reportAttachments
        }
      };
      if (obj) {
        pushToPageDataLayer(obj);
      }
      if (researchLayoutData && researchLayoutData.leftLayout && researchLayoutData.rightLayout && window.innerWidth < 767) {
        const rightLayout = this.getMobileRightLayout(researchLayoutData);
        rightLayout.forEach(layout => {
          componentAccordionStatus.push({ componentName: layout, isOpen: false, isAccordionComponent: true });
        });
        this.setState({ componentAccordionStatus });
      }
    }
  }

  componentWillUnmount() {
    this.props.resetResearchLayoutData();
    this.setState({ bluredSubjectImageSrc: '' });
    document.removeEventListener('keydown', this.closeModal);
  }

  componentWillMount() {
    this.props.getResearchLayoutData(this.props.match.params.pid);
    this.setPageTitle();
    document.addEventListener('keydown', this.closeModal);
    const blurImageList = (window.unchainedSite && window.unchainedSite.BlurredImage && window.unchainedSite.BlurredImage.publication_details_images) || [RESEARCH_LAYOUT_PIXELATED_IMAGE];
    const randomNumber = Math.floor(Math.random() * ((blurImageList && blurImageList.length) || 1));
    const bluredSubjectImageSrc = blurImageList[randomNumber];
    this.setState({ bluredSubjectImageSrc });
  }

  closeModal = (e) => {
    if (e.keyCode === 27) {
      this.closeMessageModal();
    }
  }

  getComponentBuildInProgressMessage = (componentName = '') => {
    return (<Message
      warning
      header={'Component work in Progress'}
      content={`We are working hard at building ${componentName} component`}
    />);
  }

  grantAccessToReadContent = () => {
    const { researchLayoutData } = this.props;
    this.props.getResearchLayoutData(null, researchLayoutData.yes_link);
  }

  closeMessageModal = () => {
    this.setState({ messageModalOpen: false });
  }

  getPublicationAccessWarningMsg() {
    const { researchLayoutData } = this.props;
    const content = (
      <div className="customWarningMsgModal">
        <div className="closeButtonHolder">
          <Button tabIndex={0} className="modal-close-icon bmo-close-btn bg-icon-props" onClick={this.closeMessageModal} aria-label="Close Modal" />
        </div>
        <div>
          {researchLayoutData.message}
        </div>
        <div className="actionButtons">
          <Button className="navBtn" secondary onClick={this.closeMessageModal} aria-label="Close Modal" content="No" />
          <Button secondary content="Yes" onClick={this.grantAccessToReadContent} />
        </div>
      </div>
    );
    return (
      <div>
        {this.getPixelatedContent(content)}
      </div>
    );
  }

  getTierMappingData = (dataSrc) => {
    if (dataSrc && dataSrc._source) {
      return {
        tier1: dataSrc._source.tier_1 || false,
        tier2: dataSrc._source.tier_2 || false,
        tier3: dataSrc._source.tier_3 || false,
      };
    }
    return null;
  }

  isShowAvailableOnlyInPDFMessage = (allData) => {
    const mainContentData = allData._source && allData._source.MainContent ? allData._source.MainContent : {};
    const bottomLineExists = mainContentData && mainContentData.bottomLine && mainContentData.bottomLine !== '';
    const keyPointsExists = mainContentData && mainContentData.keyPoints && mainContentData.keyPoints !== '';
    const summaryExists = mainContentData && mainContentData.summary && mainContentData.summary !== '';
    const showAvailableOnlyInPDFMessage = !(bottomLineExists || keyPointsExists || summaryExists);
    return showAvailableOnlyInPDFMessage;
  }

  getComponentData = (layout, dataSrc = this.props.researchLayoutData) => {
    if (layout) {
      const { match, isAuthenticated } = this.props;
      const tierMap = this.getTierMappingData(dataSrc);
      return layout.map(componentName => {
        if (Components[componentName]) {
          const Element = Components[componentName];
          if (componentName === 'MainContent' || componentName === 'Sections') {
            return (
              <Element
                data={dataSrc._source[componentName]}

                pid={match.params.pid}
                isLoggedIn={isAuthenticated}
                updateSearchTerm={(val) => this.updateSearchTerm(val)}
                productId={dataSrc._source.productId}
                type={this.props.researchLayoutData.type}
                tierMap={tierMap}
                showAvailableOnlyInPDFMessage={this.isShowAvailableOnlyInPDFMessage(dataSrc)}
              />
            );
          }
          return (
            <Element
              data={dataSrc._source[componentName]}
              mainTitle={(dataSrc._source && dataSrc._source.MainContent && dataSrc._source.MainContent.title) || ''}
              type={dataSrc.type}
              pid={match.params.pid}
              isLoggedIn={true}
              baseUrl={dataSrc._source.BaseUrl}
              productId={dataSrc._source.productId}
              showAvailableOnlyInPDFMessage={this.isShowAvailableOnlyInPDFMessage(dataSrc)}
            />
          );
        }
        return (this.getComponentBuildInProgressMessage(componentName));
      });
    }
    return null;
  }

  getNotLoggedInLeftComponentData = () => {
    const { researchLayoutData, match } = this.props;
    const layout = researchLayoutData.leftLayout;
    let stopBuilding = false;
    if (layout) {
      return layout.map(componentName => {
        if (stopBuilding === true) return null;
        if (componentName === 'MainContent' || layout.length < 2) stopBuilding = true;

        if (Components[componentName]) {
          const Element = Components[componentName];
          let data = researchLayoutData._source[componentName];
          if (componentName === 'MainContent') {
            const title = data.title;
            let bottomLine = null;
            let keyPoints = null;

            if (data.bottomLine) {
              bottomLine = data.bottomLine.substring(0, 550);
            } else if (data.keyPoints) {
              keyPoints = data.keyPoints.substring(0, 550);
            }
            data = {
              title,
              bottomLine,
              keyPoints
            };
          }
          return <Element data={data} pid={match.params.pid} type={researchLayoutData.type} isLoggedIn={false} />;
        }
        return (this.getComponentBuildInProgressMessage(componentName));
      });
    }
    return null;
  }

  getNotLoggedInRightComponentData = () => {
    const { researchLayoutData } = this.props;
    const layout = researchLayoutData.rightLayout;
    let stopBuilding = false;
    if (layout) {
      return layout.map((componentName, index) => {
        if (stopBuilding === true) return null;
        if (index >= 2 || layout.length < 2) stopBuilding = true;

        if (Components[componentName]) {
          const Element = Components[componentName];
          return <Element data={researchLayoutData._source[componentName]} type={researchLayoutData.type} isLoggedIn={false} />;
        }
        return (this.getComponentBuildInProgressMessage(componentName));
      });
    }
    return null;
  }

  dispatchLoginAction = (msg) => {
    window.scrollTo(0, 0);
    this.props.onSignInClick(msg);
  }

  updateSearchTerm = (term) => {
    this.setState({ searchTerm: term });
  }

  showMoreResearchPublications = () => {
    this.setState({ showMoreIndex: this.state.showMoreIndex + 1 });
  }

  getPixelatedContent = (content) => {
    const { bluredSubjectImageSrc } = this.state;
    return (
      <div className="pixelated-image-container">
        <Image className="pixelated-image" src={bluredSubjectImageSrc} />
        <div className="read-more-content">
          {content}
        </div>
      </div>
    );
  }

  buildUI = () => {
    if (window.innerWidth < 767) {
      return this.buildMobileUI();
    }
    return this.buildDesktopUI();
  }

  getMobileComponentData = (layout, dataSrc = this.props.researchLayoutData) => {
    const { componentAccordionStatus } = this.state;
    if (layout) {
      const { match, isAuthenticated, isPrivateView } = this.props;
      const tierMap = this.getTierMappingData(dataSrc);
      return layout.map(componentName => {
        const accordianComponent = componentAccordionStatus.find(component => component.componentName === componentName);
        if (Components[componentName]) {
          const Element = Components[componentName];
          if (componentName === 'MainContent' || componentName === 'Sections') {
            if (accordianComponent) {
              return (
                <Element
                  data={dataSrc._source[componentName]}
                  isPrivateView={isPrivateView}
                  pid={match.params.pid}
                  isLoggedIn={isAuthenticated}
                  updateSearchTerm={(val) => this.updateSearchTerm(val)}
                  productId={dataSrc._source.productId}
                  type={this.props.researchLayoutData.type}
                  tierMap={tierMap}
                  isOpen={accordianComponent.isOpen}
                  isAccordionComponent={accordianComponent.isAccordionComponent}
                  handleAccordionClick={this.handleAccordionClick}
                  showAvailableOnlyInPDFMessage={this.isShowAvailableOnlyInPDFMessage(dataSrc)}
                />
              );
            }
            return (
              <Element
                data={dataSrc._source[componentName]}
                isPrivateView={isPrivateView}
                pid={match.params.pid}
                isLoggedIn={isAuthenticated}
                updateSearchTerm={(val) => this.updateSearchTerm(val)}
                productId={dataSrc._source.productId}
                type={this.props.researchLayoutData.type}
                tierMap={tierMap}
                handleAccordionClick={this.handleAccordionClick}
                showAvailableOnlyInPDFMessage={this.isShowAvailableOnlyInPDFMessage(dataSrc)}
              />
            );
          }
          if (accordianComponent) {
            return (
              <Element
                data={dataSrc._source[componentName]}
                isPrivateView={isPrivateView}
                mainTitle={(dataSrc._source && dataSrc._source.MainContent && dataSrc._source.MainContent.title) || ''}
                type={dataSrc.type}
                pid={match.params.pid}
                isLoggedIn={true}
                baseUrl={dataSrc._source.BaseUrl}
                productId={dataSrc._source.productId}
                isOpen={accordianComponent.isOpen}
                handleAccordionClick={this.handleAccordionClick}
                isAccordionComponent={accordianComponent.isAccordionComponent}
                showAvailableOnlyInPDFMessage={this.isShowAvailableOnlyInPDFMessage(dataSrc)}
              />
            );
          }
          return (
            <Element
              isPrivateView={isPrivateView}
              data={dataSrc._source[componentName]}
              mainTitle={(dataSrc._source && dataSrc._source.MainContent && dataSrc._source.MainContent.title) || ''}
              type={dataSrc.type}
              pid={match.params.pid}
              isLoggedIn={true}
              baseUrl={dataSrc._source.BaseUrl}
              productId={dataSrc._source.productId}
              showAvailableOnlyInPDFMessage={this.isShowAvailableOnlyInPDFMessage(dataSrc)}
            />
          );
        }
        return (this.getComponentBuildInProgressMessage(componentName));
      });
    }
    return null;
  }

  getMobileRightLayout = (layoutData) => {
    const researchLayoutData = layoutData;

    if (researchLayoutData && researchLayoutData.rightLayout && researchLayoutData.leftLayout) {
      const rightLayoutAppendData = [];
      const isDisplayPublishDateExists = researchLayoutData.leftLayout.find(ele => ele === 'DisplayPublishDate');
      const isResearchTitleExists = researchLayoutData.leftLayout.find(ele => ele === 'ResearchTitle');
      const isCompanyPerformanceExists = researchLayoutData.leftLayout.find(ele => ele === 'CompanyPerformance');
      if (isDisplayPublishDateExists) {
        researchLayoutData.rightLayout.find(ele => ele === 'DisplayPublishDate') ? null : rightLayoutAppendData.push('DisplayPublishDate');
      }
      if (isResearchTitleExists) {
        researchLayoutData.rightLayout.find(ele => ele === 'ResearchTitle') ? null : rightLayoutAppendData.push('ResearchTitle');
      }
      if (isCompanyPerformanceExists) {
        researchLayoutData.rightLayout.find(ele => ele === 'CompanyPerformance') ? null : rightLayoutAppendData.push('CompanyPerformance');
      }
      researchLayoutData.rightLayout = [...rightLayoutAppendData, ...researchLayoutData.rightLayout];
    }
    return researchLayoutData.rightLayout;
  }

  buildMobileUI = () => {
    const { researchLayoutData, isLoading, isAuthenticated, profile, isPrivateView } = this.props;
    const { showMoreIndex, messageModalOpen, mobileShowMoreCards } = this.state;
    const canBookmark = profile && profile.can_access_content && profile.can_bookmark_content;
    const canFollow = profile && profile.can_access_content && profile.can_follow_content;
    let isMoreCardReauired = false;
    let customRightLayout;
    let customRightMoreCards;

    if (researchLayoutData && researchLayoutData.rightLayout && researchLayoutData.leftLayout) {
      researchLayoutData.rightLayout = this.getMobileRightLayout(researchLayoutData);
      const analystsComponentIndex = researchLayoutData.rightLayout.findIndex(layout => layout === 'Analysts');
      const isVolumeChartExists = researchLayoutData.rightLayout.find(layout => layout === 'VolumeChart');
      if (analystsComponentIndex > -1 && researchLayoutData.rightLayout.length > analystsComponentIndex + 2) {
        isMoreCardReauired = true;
        if (isVolumeChartExists) {
          customRightLayout = researchLayoutData.rightLayout.slice(0, analystsComponentIndex + 2);
          customRightMoreCards = researchLayoutData.rightLayout.slice(analystsComponentIndex + 2);
        } else {
          customRightLayout = researchLayoutData.rightLayout.slice(0, analystsComponentIndex + 1);
          customRightMoreCards = researchLayoutData.rightLayout.slice(analystsComponentIndex + 1);
        }
      }
      researchLayoutData.leftLayout = researchLayoutData.leftLayout.filter(layout => layout !== 'DisplayPublishDate' || layout !== 'ResearchTitle' || layout !== 'CompanyPerformance');
    }
    const loggeOutMarkup = this.getPixelatedContent(null);
    const contactMessage = (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.COMMON_CONTACT_MESSAGE) || 'For more information, please contact us.';
    if (isLoading === false) {
      if (!isAuthenticated && isPrivateView) {
        return loggeOutMarkup;
      }
      if (researchLayoutData.show_modal) {
        let content = null;

        if (messageModalOpen) {
          if (researchLayoutData.type === 'PENDING_CAN_READ') {
            content = this.getPublicationAccessWarningMsg();
          } else {
            content = (
              <div className="customWarningMsgModal">
                <div className="closeButtonHolder">
                  <Button tabIndex={0} className="modal-close-icon bmo-close-btn bg-icon-props" onClick={this.closeMessageModal} aria-label="Close Modal" />
                </div>
                {researchLayoutData.message}
                <br />
                {contactMessage}
                <div className="image-link-div-wrapper">
                  <div className="image-link-div ">
                    <div title="Email" className="forgot-email-template-image forgot-mail-icon" />
                    <a title="research@bmo.com" href="mailto:research@bmo.com" className={'forgot-email-template-label email'}>research@bmo.com</a>
                  </div>
                </div>
                <div className={'warningMsgModalCloseDiv'}>
                  <Button className="closeBtn" tabIndex={0} secondary onClick={this.closeMessageModal} content="Close" />
                </div>
              </div>
            );
          }
        }
        return this.getPixelatedContent(content);
      }

      let fourZeroFourObject = {
        richText: '<div class="rich-text"><h1>Oops! </h1><p> We can’t find that page.<br/></p></div>',
        buttonText: 'Go to homepage',
      };

      window.unchainedSite.page['/404/'].map((value) => {
        if (value.FourZeroFour !== undefined) {
          fourZeroFourObject = value.FourZeroFour;
        }
      });

      if (researchLayoutData.message) {
        return (
          <FourZeroFour
            image={(fourZeroFourObject && fourZeroFourObject.image) || ''}
            richText={researchLayoutData.message || ''}
            buttonText={(fourZeroFourObject && fourZeroFourObject.buttonText) || ''}
          />
        );
      }
    }

    if (researchLayoutData &&
      researchLayoutData.type &&
      (researchLayoutData.type.toLowerCase() === 'podcast' || researchLayoutData.type.toLowerCase() === 'videocast')
    ) {
      return (
        <VideocastDetailsListing
          bookmarks={this.props.bookmarks}
          dispDate={researchLayoutData.DisplayPublishDate}
          allInfo={researchLayoutData._source}
          isLoggedIn={isAuthenticated}
          canBookmark={canBookmark}
          canFollow={canFollow}
          profile={profile}
          isAccordionComponent={true}
          type={researchLayoutData.type.toLowerCase()}
        />
      );
    }

    return (
      <div className={'research-layout-builder-grid'} id="research-layout-builder-grid">
        <Grid className="layouts">
          <Grid.Column mobile={12} className="tablet layout-right research-lyout-builder-layout-right">
            <div id="research-lyout-builder-layout-right" />
            {
              isMoreCardReauired ?
                <div>
                  {this.getMobileComponentData(customRightLayout)}
                  <div className="read-more-cards">
                    <div className="more-header">
                      More
                    </div>
                    {mobileShowMoreCards &&
                    <div className="more-contents">
                      {this.getMobileComponentData(customRightMoreCards)}
                    </div>
                    }
                    <Button className={`linkBtn ${mobileShowMoreCards ? 'bmo_chevron' : 'bmo_chevron bottom'}`} onClick={() => { this.setState({ mobileShowMoreCards: !mobileShowMoreCards }); }} />
                  </div>
                </div> :
                this.getMobileComponentData(researchLayoutData.rightLayout)
            }
          </Grid.Column>
          <Grid.Column mobile={12} className="layout-left">
            {this.getMobileComponentData(researchLayoutData.leftLayout)}
          </Grid.Column>
          { (!isAuthenticated && isPrivateView) ? loggeOutMarkup : null }
        </Grid>
        <Grid>
          <Grid.Column mobile={12} className="related-content-layout center-layout">
            {this.getMobileComponentData(researchLayoutData.centerLayout)}
          </Grid.Column>
        </Grid>
        {
          (researchLayoutData.publications) ?
            researchLayoutData.publications.slice(0, showMoreIndex).map(publication => {
              return (
                <Grid>
                  <Grid.Column computer={8} tablet={12} mobile={12}>
                    {this.getMobileComponentData(publication.leftLayout, publication)}
                  </Grid.Column>
                  <Grid.Column computer={4} tablet={12} mobile={12}>
                    {this.getMobileComponentData(publication.rightLayout, publication)}
                  </Grid.Column>
                </Grid>
              );
            })
            : null
        }
        {
          (researchLayoutData.publications && showMoreIndex < researchLayoutData.publications.length) ?
            <Button className="linkBtn showMorePublicationBtn" onClick={() => this.showMoreResearchPublications()}>Show More</Button>
            : null
        }
      </div>
    );
  }

  buildDesktopUI = () => {
    const { researchLayoutData, isLoading, isAuthenticated, profile, isPrivateView } = this.props; // eslint-disable-line
    const { showMoreIndex, messageModalOpen } = this.state;
    const canBookmark = profile && profile.can_access_content && profile.can_bookmark_content;
    const canFollow = profile && profile.can_access_content && profile.can_follow_content;

    const loggeOutMarkup = this.getPixelatedContent(null);
    const contactMessage = (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.COMMON_CONTACT_MESSAGE) || 'For more information, please contact us.';

    if (isLoading === false) {
      if (!isAuthenticated && isPrivateView) {
        return loggeOutMarkup;
      }
      if (researchLayoutData.show_modal) {
        let content = null;

        if (messageModalOpen) {
          if (researchLayoutData.type === 'PENDING_CAN_READ') {
            content = this.getPublicationAccessWarningMsg();
          } else {
            content = (
              <div className="customWarningMsgModal">
                <div className="closeButtonHolder">
                  <Button tabIndex={0} className="modal-close-icon bmo-close-btn bg-icon-props" onClick={this.closeMessageModal} aria-label="Close Modal" />
                </div>
                {researchLayoutData.message}
                <br />
                {contactMessage}
                <div className="image-link-div-wrapper">
                  <div className="image-link-div ">
                    <div title="Email" className="forgot-email-template-image forgot-mail-icon" />
                    <a title="research@bmo.com" href="mailto:research@bmo.com" className={'forgot-email-template-label email'}>research@bmo.com</a>
                  </div>
                </div>
                <div className={'warningMsgModalCloseDiv'}>
                  <Button className="closeBtn" tabIndex={0} secondary onClick={this.closeMessageModal} content="Close" />
                </div>
              </div>
            );
          }
        }
        return this.getPixelatedContent(content);
      }

      let fourZeroFourObject = {
        richText: '<div class="rich-text"><h1>Oops! </h1><p> We can’t find that page.<br/></p></div>',
        buttonText: 'Go to homepage',
      };

      window.unchainedSite.page['/404/'].map((value) => {
        if (value.FourZeroFour !== undefined) {
          fourZeroFourObject = value.FourZeroFour;
        }
      });

      if (researchLayoutData.message) {
        return (
          <FourZeroFour
            image={(fourZeroFourObject && fourZeroFourObject.image) || ''}
            richText={researchLayoutData.message || ''}
            buttonText={(fourZeroFourObject && fourZeroFourObject.buttonText) || ''}
          />
        );
      }
    }

    if (researchLayoutData &&
      researchLayoutData.type &&
      (researchLayoutData.type.toLowerCase() === 'videocast' || researchLayoutData.type.toLowerCase() === 'podcast')
    ) {
      return (
        <VideocastDetailsListing
          bookmarks={this.props.bookmarks}
          dispDate={researchLayoutData.DisplayPublishDate}
          allInfo={researchLayoutData._source}
          isLoggedIn={isAuthenticated}
          canBookmark={canBookmark}
          canFollow={canFollow}
          profile={profile}
          type={researchLayoutData.type.toLowerCase()}
        />
      );
    }

    // if (researchLayoutData && researchLayoutData.type === 'full_attachment') {
    //   return (
    //     <FullAttachmentPublication
    //       bookmarks={this.props.bookmarks}
    //       allInfo={researchLayoutData._source || {}}
    //       rawData={researchLayoutData.rawData}
    //       isLoggedIn={isAuthenticated}
    //       canBookmark={canBookmark}
    //       canFollow={canFollow}
    //       profile={profile}
    //       type={researchLayoutData.type}
    //       updateSearchTerm={(val) => this.updateSearchTerm(val)}
    //     />
    //   );
    // }

    return (
      <div className={'research-layout-builder-grid'} id="research-layout-builder-grid">
        <Grid className="layouts">
          <Grid.Column computer={8} tablet={12} mobile={12} className="layout-left">
            {this.getComponentData(researchLayoutData.leftLayout)}
          </Grid.Column>
          <Divider />
          <Grid.Column computer={4} tablet={12} mobile={12} className="tablet layout-right research-lyout-builder-layout-right">
            <div id="research-lyout-builder-layout-right" />
            {this.getComponentData(researchLayoutData.rightLayout)}
          </Grid.Column>
          { (!isAuthenticated && isPrivateView) ? loggeOutMarkup : null }
        </Grid>
        <Grid>
          <Grid.Column computer={12} tablet={12} mobile={12} className="related-content-layout center-layout">
            {this.getComponentData(researchLayoutData.centerLayout)}
          </Grid.Column>
        </Grid>
        {
          (researchLayoutData.publications) ?
            researchLayoutData.publications.slice(0, showMoreIndex).map(publication => {
              return (
                <Grid >
                  <Grid.Column computer={8} tablet={12} mobile={12}>
                    {this.getComponentData(publication.leftLayout, publication)}
                  </Grid.Column>
                  <Grid.Column computer={4} tablet={12} mobile={12}>
                    {this.getComponentData(publication.rightLayout, publication)}
                  </Grid.Column>
                </Grid>
              );
            })
            : null
        }
        {
          (researchLayoutData.publications && showMoreIndex < researchLayoutData.publications.length) ?
            <Button className="linkBtn showMorePublicationBtn" onClick={() => this.showMoreResearchPublications()}>Show More</Button>
            : null
        }
      </div>
    );
  }

  handleAccordionClick = (componentName) => {
    const { componentAccordionStatus } = this.state;
    let updatedStatus = [];
    updatedStatus = componentAccordionStatus.map(comp => {
      const compData = comp;
      if (compData.componentName === componentName) {
        compData.isOpen = !compData.isOpen;
        return compData;
      }
      return compData;
    });
    this.setState({ componentAccordionStatus: updatedStatus });
  }

  getPublicationTierData = (layout) => {
    if (layout && layout._source) {
      const tierMap = this.getTierMappingData(layout);
      const triangleImage = getTriangleImage(tierMap);
      if (triangleImage) {
        return (
          <div className={'triangle-image'}>
            <Image alt={'Brand-triangle'} src={tierImageMap[triangleImage[0]]} className={'brand-triangle-licon'} />
            <span className={'brand-text'}>{triangleImage[1]}</span>
          </div>
        );
      }
    }
    return null;
  }

  renderLoader = () => {
    const dimmer = document.querySelector('#docs-loading-dimmer');
    if (dimmer) {
      dimmer.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(dimmer);
        document.body.setAttribute('class', '');
        window.removeEventListener('load', removeDimmer);
      }, 0);
    }
    return <Loader active={true} content="Loading..." />;
  }

  render() {
    const { isLoading } = this.props;
    return (
      <div className="research-layout-builder">
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Header' : 'CorporateDebt-Header'} />
        <div className="research-layout-builder-main-wrapper">
          {isLoading ?
            this.renderLoader()
            :
            this.buildUI()
          }
        </div>
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Footer' : 'CorporateDebt-Footer'} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  researchLayoutData: researchSelector.getResearchLayoutData(state),
  isLoading: researchSelector.getIsLoading(state),
  isPrivateView: researchSelector.isPrivateView(state),
  accessLimit: userSelector.getUserAccessLimit(state),
  isAuthenticated: userSelector.getIsLoggedIn(state),
  bookmarks: userSelector.getBookmarkIds(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  getResearchLayoutData: (pid, url = '') => {
    dispatch(GET_RESEARCH_LAYOUT_DATA(pid, url));
  },
  onSignInClick: (msg) => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_SIGN_IN_CLICKED, data: msg });
  },
  resetResearchLayoutData: () => {
    dispatch({ type: SET_RESEARCH_LAYOUT_DATA, data: {} });
  },
  hideLoginModal: () => {
    dispatch({ type: SHOW_LOGIN_MODEL, data: false });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ResearchLayoutBuilder));
