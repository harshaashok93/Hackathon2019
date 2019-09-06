/* @flow weak */

/*
 * Component: HistoricalPdfPage
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { getLocalToken } from 'api/auth';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'unchained-ui-react';
import { JSONComponentBuilder } from 'containers';
import {
  GET_RESEARCH_LAYOUT_META_DATA,
  SET_RESEARCH_LAYOUT_META_DATA,
} from 'store/actions';

import {
  researchSelector,
  userSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './HistoricalPdfPage.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class HistoricalPdfPage extends Component {
  props: {
    match: {
      params: {
        radarLink: ''
      }
    },
    researchLayoutData: {},
    getResearchLayoutData: () => void,
    resetResearchLayoutData: () => void,
    history: {
      push: () => void
    },
    rdsPubId: '',
    isAuthenticated: boolean,
  };

  static defaultProps = {
  };

  state = {
    showModal: false,
    messageModalOpen: true,
    researchLayoutData: {},
    idxnextProps: '',
    readPublicationList: []
  };

  newWindowRef = '';

  componentWillMount() {
    document.addEventListener('keydown', this.closeModal);
    this.populateReadPublicationList();
  }

  componentWillUnMount() {
    this.props.resetResearchLayoutData();
    document.removeEventListener('keydown', this.closeModal);
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated } = nextProps;
    if ((isAuthenticated && (isAuthenticated !== this.props.isAuthenticated))) {
      this.init();
    }
    if (nextProps.researchLayoutData && Object.keys(nextProps.researchLayoutData)) {
      this.setState({ researchLayoutData: Object.assign({}, nextProps.researchLayoutData) });
    } else {
      this.setState({ researchLayoutData: {} });
    }
    this.populateReadPublicationList(nextProps);
  }

  populateReadPublicationList(props = this.props) {
    const { profile } = props;
    if (profile && profile.read_publications) {
      this.setState({ readPublicationList: profile.read_publications.map(pub => pub.product_id) });
    }
  }

  isPubRead() {
    const { rdsPubId, match } = this.props;
    const { radarLink } = match.params;
    const { readPublicationList } = this.state;

    if (readPublicationList && readPublicationList.length) {
      return readPublicationList.filter(pid => ((pid === rdsPubId) || (radarLink.indexOf(pid) > -1))).length > 0;
    }
    return false;
  }

  init() {
    const { match, getResearchLayoutData } = this.props;
    const { radarLink } = match.params;
    this.setState({ messageModalOpen: true, radarLink }, () => {
      getResearchLayoutData(`/publication/getPublicationPdf/?id=${radarLink}`);
    });
  }

  closeModal = (e) => {
    if (e.keyCode === 27) {
      this.closeMessageModal();
      this.closeWindowOnClick();
    }
  }

  closeMessageModal = () => {
    this.setState({ messageModalOpen: false, radarLink: '' }, () => {
      this.props.resetResearchLayoutData();
    });
  }

  grantAccessToReadContent = () => {
    const { researchLayoutData } = this.state;
    if (researchLayoutData.yes_link) {
      window.location = `${window.location.origin}/api/v1${researchLayoutData.yes_link}`;
      this.closeMessageModal();
    } else if (researchLayoutData.videocast_link) {
      this.props.history.push(researchLayoutData.videocast_link);
    }
  }

  getPublicationAccessWarningMsg() {
    const { researchLayoutData } = this.state;
    return (
      <div className="customWarningMsgModal">
        <div className="closeButtonHolder">
          <Button tabIndex={0} className="modal-close-icon bmo-close-btn bg-icon-props" onClick={this.closeWindowOnClick} aria-label="Close Modal" />
        </div>
        <div>
          {researchLayoutData.message}
        </div>
        <div className="actionButtons">
          <Button
            onClick={this.closeWindowOnClick}
            secondary
            content="No"
          />
          <Button
            secondary
            content="Yes"
            onClick={() => {
              this.grantAccessToReadContent();
            }}
          />
        </div>
      </div>
    );
  }

  closeWindowOnClick = () => {
    const { history } = this.props;
    if (window.close()) {
      window.close();
    } else {
      history.push('/');
    }
  }

  getMessageModal() {
    const { messageModalOpen } = this.state;
    const { researchLayoutData } = this.props;
    const token = getLocalToken();
    if (!token) {
      let allPagesData = {};
      const pageSlug = '/pdf-page/';
      let jsonArray = [];
      allPagesData = window.unchainedSite.page;
      if (allPagesData[pageSlug]) {
        jsonArray = allPagesData[pageSlug];
        const components = require('components');
        return <JSONComponentBuilder components={components} jsonArray={jsonArray} />;
      }
    }
    const contactMessage = (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.COMMON_CONTACT_MESSAGE) || 'For more information, please contact us.';
    if (researchLayoutData.show_modal && messageModalOpen) {
      let content = null;
      if (researchLayoutData.type === 'PENDING_CAN_READ') {
        content = this.getPublicationAccessWarningMsg();
      } else {
        content = (
          <div className="customWarningMsgModal">
            <div className="closeButtonHolder">
              <Button tabIndex={0} className="modal-close-icon bmo-close-btn bg-icon-props" onClick={this.closeWindowOnClick} aria-label="Close Modal" />
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
            <div>
              <Button className="closeBtn" tabIndex={0} secondary onClick={this.closeWindowOnClick} content="Close" />
            </div>
          </div>
        );
      }
      return <div className="customnavlinMessageHolder">{content}</div>;
    } else if (researchLayoutData.show_modal === false && researchLayoutData.yes_link && messageModalOpen) {
      this.grantAccessToReadContent();
    } else if (researchLayoutData.show_modal === false && researchLayoutData.videocast_link) {
      this.props.history.push(researchLayoutData.videocast_link);
    }
    return null;
  }

  render() {
    const msgModal = this.getMessageModal();
    return (
      <div className="historical-pdf-page">
        {msgModal}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  researchLayoutData: researchSelector.getResearchLayoutMetaData(state),
  profile: userSelector.getUserProfileInfo(state),
  isAuthenticated: userSelector.getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  getResearchLayoutData: (url = '') => {
    dispatch(GET_RESEARCH_LAYOUT_META_DATA(url));
  },
  resetResearchLayoutData: () => {
    dispatch({ type: SET_RESEARCH_LAYOUT_META_DATA, data: {} });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalPdfPage);
