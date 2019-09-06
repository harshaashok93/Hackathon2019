/* @flow weak */

/*
 * Component: Onboarding
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Container, Heading, Modal, Image, Loader } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';
import { ON_BOARDING_WELCOME_IMAGE, ON_BOARDING_FAILED_IMAGE } from 'constants/assets';
import { ContactUsForm } from 'components';

import Sectors from './sections/Sectors';
import SubSectors from './sections/SubSectors';
import Analysts from './sections/Analysts';


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './Onboarding.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Onboarding extends Component {
  props: {
    showModal: Boolean,
    sectors: [],
    // getSubSectors: () => void,
    closeOnboardingScreen: () => void,
    getOnboardingAnalysts: () => void,
    postOnboardingSubmission: () => void,
    setScreenIndex: () => void,
    subsectors: [],
    screenIndex: number,
    analysts: [],
    success: bool,
    pageSequence: number,
    isLoading: bool,
  };

  static defaultProps = {
  };

  state = {
    showModal: this.props.showModal,
    disabled: true,
    showContactUs: false,
  };

  componentDidMount() {
  }

  sectorSelections = []
  subSectorSelections = []
  subsectorsSelectionNames = []
  analystSelections = []

  handleSectorSelection = (data, shouldRemove) => {
    if (!data) return;
    const index = this.sectorSelections.indexOf(data);
    if (shouldRemove) {
      if (index === -1) return;
      this.sectorSelections.splice(index, 1);
    } else if (index === -1) {
      this.sectorSelections.push(data);
    }
    this.setState({
      disabled: (this.sectorSelections.length === 0)
    });
  }

  handleSubSectorSelection = (data, names) => {
    if (!data) return;
    this.subSectorSelections = data;
    this.subsectorsSelectionNames = names;
    this.setState({
      disabled: (data.length === 0)
    });
  }

  handleAnalystSelection = (data) => {
    if (!data) return;
    this.analystSelections = data;
    this.setState({
      disabled: (data.length === 0)
    });
  }

  getName = (listObj, listId, keyId, keyName) => {
    const arrObj = listObj.filter((data) => {
      return listId.indexOf(data[keyId]) !== -1;
    });
    const selectionNames = [];
    arrObj.map((item) => {
      selectionNames.push(item[keyName]);
    });
    return selectionNames;
  }

  componentWillReceiveProps(nextProps) {
    const { showModal } = nextProps;
    if ((nextProps.screenIndex !== this.props.screenIndex) && (nextProps.screenIndex === 2)) {
      const eleDiv = document.getElementById('onboardingTitle');
      if (eleDiv) {
        eleDiv.scrollIntoView();
      }
    }
    if (showModal) {
      document.body.addEventListener('touchstart', this.handleMouseUp);
    }
  }

  handleNextBtnClick = () => {
    const { screenIndex, sectors, analysts } = this.props;
    const submitParameter = {
      sectors: this.sectorSelections,
      sub_sectors: this.subSectorSelections,
      coverages: [],
      analysts: this.analystSelections,
      should_follow_companies: true,
    };

    switch (screenIndex) {
      case 0 : {
        if (this.sectorSelections.length === 0) return;
        const nameList = this.getName(Object.assign([], sectors), this.sectorSelections, 'id', 'name');
        pushToDataLayer('onboarding', 'sectorNextBtnClick', { label: nameList.join(',') });
        // this.props.getSubSectors(this.sectorSelections);
        this.props.getOnboardingAnalysts(submitParameter);
        break;
      }
      case 1 : {
        if (this.subSectorSelections.length === 0) return;
        pushToDataLayer('onboarding', 'subSectorNextBtnClick', { label: this.subsectorsSelectionNames.join(',') });
        this.props.getOnboardingAnalysts(submitParameter);
        break;
      }
      case 2 : {
        if (this.analystSelections.length === 0) return;
        const nameList = this.getName(analysts, this.analystSelections, 'id', 'name');
        pushToDataLayer('onboarding', 'analystsNextBtnClick', { label: nameList.join(',') });
        this.props.setScreenIndex(screenIndex + 1);
        break;
      }
      case 3 :
        this.props.postOnboardingSubmission(submitParameter);
        pushToDataLayer('onboarding', 'analystsNextBtnClick', { category: 'Onboarding', action: 'Welcome', label: '' });
        break;
      case 4 :
        pushToDataLayer('onboarding', 'trialMemberContinueBtnClick', { label: '' });
        this.handleClose();
        break;
      default: break;
    }
    this.setState({ disabled: true });
  }

  handleSkipBtnClick = () => {
    if (this.props.screenIndex === 0) {
      pushToDataLayer('onboarding', 'skipSectorOverlay');
    } else if (this.props.screenIndex === 4) {
      pushToDataLayer('onboarding', 'trialMemberCancelBtnClick');
    } else {
      pushToDataLayer('onboarding', 'skipSectorOverlay');
    }
    this.handleClose();
  }

  handleContactUsBtnClick = () => {
    this.setState({ showContactUs: true });
    pushToDataLayer('onboarding', 'trialMemberContactUsBtnClick');
  }

  handleClose = () => {
    document.body.removeEventListener('touchstart', this.handleMouseUp);
    this.props.closeOnboardingScreen();
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll');
  }

  responseStatus = () => () => {
    this.handleClose();
  }

  getOnBoardingModalContent() {
    const { screenIndex, pageSequence, isLoading } = this.props;
    const arr = ['A', 'B', 'C'];
    let text = '';
    let component = null;

    switch (screenIndex) {
      case 0 :
        text = 'I am interested in the following sectors:';
        if (!(this.props.sectors.length > 0)) {
          component = <Loader active={true} inverted content={'Loading ...'} />;
        } else {
          component = <Sectors sectors={this.props.sectors} callback={this.handleSectorSelection} />;
        }
        break;

      case 1 :
        text = 'I am interested in the following sub-sectors:';
        if (!(this.props.subsectors.length > 0)) {
          component = <Loader active={true} inverted content={'Loading ...'} />;
        } else {
          component = <SubSectors subsectors={this.props.subsectors} callback={this.handleSubSectorSelection} />;
        }
        break;

      case 2 :
        text = 'Based on your selections, we would recommend following these analysts:';
        component = <Analysts analysts={this.props.analysts} callback={this.handleAnalystSelection} />;
        break;

      default: return null;
    }

    return (
      <Container>
        <Container className={'sectionHeadingContainer'}>
          <span>{arr[pageSequence]}</span>
          {text}
        </Container>
        <Container id="componentHolder" className={'component-holder'}>
          {isLoading ?
            <div className={'loader-container'}><Loader active={true} content="Loading..." /></div>
            :
            component
          }
        </Container>
      </Container>
    );
  }

  renderPostOnBoardingScreens() {
    const { showModal, showContactUs } = this.state;
    const { screenIndex } = this.props;
    const mountPoint = document.getElementById('mainPageHeader');

    let content = null;
    let actionButtons = null;

    switch (screenIndex) {
      case 3 :
        content = (
          <Container className={'welcomeScreenContent'}>
            <Heading as={'h2'} content={'You are all set!'} />
            <div className={'description'}>{'We have customized our content based on your selections.'} </div>
            <Image shape={'circular'} className={'onboard-welcome'} src={ON_BOARDING_WELCOME_IMAGE} />
          </Container>
        );
        actionButtons = (
          <Modal.Actions className={'welcomeScreenActionBtns'}>
            <Button secondary content={'Done'} onClick={this.handleNextBtnClick} />
          </Modal.Actions>
        );
        pushToDataLayer('onboarding', 'registrationCompOverlay');
        break;

      case 4 :
        if (this.props.success === true) {
          this.handleClose();
          return null;
        } else if (this.props.success === false) {
          content = (
            <Container>
              <Heading as={'h2'} content={'Sorry!'} />
              <div className={'description'}>{'We were unable to create your account at this time. Please contact us if you have any questions.'}</div>
              <Image shape={'circular'} className={'onboard-failed'} src={ON_BOARDING_FAILED_IMAGE} />
            </Container>
          );
          actionButtons = (
            <Modal.Actions>
              <Button secondary content={'Cancel'} onClick={this.handleSkipBtnClick} />
              <Button secondary content={'Contact Us'} onClick={this.handleContactUsBtnClick} />
            </Modal.Actions>
          );
          pushToDataLayer('onboarding', 'trialMemberErrorOverlay');
        } else if (!this.props.success) {
          content = (
            <Container className={'postOnBoard-container'}>
              <Loader active={true} content={'Submitting Response...'} />
            </Container>
          );
        }
        break;
      default: return null;
    }

    return (
      <div>
        <Modal
          open={showModal}
          className="onboarding postOnBoarding"
          closeOnDocumentClick={false}
          closeOnDimmerClick={true}
          onClose={this.handleClose}
        >
          <Modal.Header id="postOnboardingTitle" className={'postboard-header'}>
            <div className="close-image">
              <Button tabIndex={0} className="bmo-close-btn bg-icon-props" onClick={() => this.handleClose()} />
            </div>
          </Modal.Header>
          <Modal.Content>
            {content}
          </Modal.Content>
          {actionButtons}
        </Modal>
        {showContactUs &&
          <ContactUsForm
            isContactUsFormOpen={showContactUs}
            sendResponseStatus={this.responseStatus()}
            contactUsFormType={'contactus'}
            closeContactUsForm={this.closeContactUsForm}
            mountNode={mountPoint}
          />
        }
      </div>
    );
  }

  closeContactUsForm = () => {
    this.setState({ showContactUs: false });
  }

  handleMouseUp = (e) => {
    if ((e.target.className.indexOf('ui page modals dimmer transition visible active') > -1)) {
      // Adding new classname to overlay parent will not let to close overlay in tablets, on touch of background.
      this.handleClose();
    }
  }

  render() {
    const { showModal, disabled } = this.state;
    const { screenIndex } = this.props;
    const modalContent = this.getOnBoardingModalContent();
    const message = window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Welcome to BMO Equity Research.' : 'Welcome to BMO Corporate Debt.';
    if (!modalContent && screenIndex > 2) {
      return this.renderPostOnBoardingScreens();
    }
    return (
      <Modal
        open={showModal}
        className="onboarding"
        closeOnDocumentClick={false}
        closeOnDimmerClick={true}
        onClose={this.handleClose}
        role="dialog"
        aria-labelledby="onboardingTitle"
        aria-describedby="onboardingDesc"
      >
        <Modal.Header id="onboardingTitle">
          <div className="close-image">
            <Button tabIndex={0} className="bmo-close-btn bg-icon-props" onClick={() => this.handleClose()} />
          </div>
          <Heading as={'h2'} content={message} />
          <Heading as={'h3'} content="Please choose the following to help customize your experience." />
        </Modal.Header>
        <Modal.Content id="onboardingDesc">
          {this.getOnBoardingModalContent()}
        </Modal.Content>
        <Modal.Actions>
          <div className={'button-wrap'}>
            <Button secondary content={'Skip'} onClick={this.handleSkipBtnClick} />
            <Button secondary disabled={disabled} onClick={this.handleNextBtnClick} content={'Next'} />
          </div>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Onboarding;
