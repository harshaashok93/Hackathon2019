/* @flow weak */

/*
 * Component: BmoModelResultCard
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import moment from 'moment';
import config from 'config';
import { connect } from 'react-redux';
import { Button, Image, Container } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
import { DEFAULT_PROFILE, tierImageMap } from 'constants/assets';
import { downloadBlobFile, toShowAnalyst, getTriangleImage } from 'utils';
import {
  userSelector,
} from 'store/selectors';
import {
  downloadBMOModelsFile,
} from 'api/bmomodels';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { BmoPopUp, RetailConsumerTeamCard, RichText, DownloadFailedModal, CannabisPreviewModal, LibrarySearchResultOverlay } from 'components';
import './BmoModelResultCard.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class BmoModelResultCard extends Component {
  props: {
    data: {},
    api: '',
    profile: {},
    isLoggedIn: Boolean,
  };

  static defaultProps = {
  };

  state = {
    isRetailConsumerOpen: false,
    isDownloadingFailed: false,
    isCannabis: false,
  };

  handleDownloadClick = async (data) => {
    this.setState({ isDownloading: true });
    pushToDataLayer('databoutique', 'companyDataSetDownload', { label: data.name });
    downloadBMOModelsFile(this.props.api, data.id).then(r => {
      if (r.ok) {
        return r.blob();
      }
      return null;
    }).then((result) => {
      if (!result) {
        this.setState({ isDownloadingFailed: true });
        return;
      }
      downloadBlobFile({
        content: result,
        contentType: data.mime_type,
        filename: data.file_name
      });
      this.setState({ isDownloading: false });
    }).catch(() => {
      this.setState({ isDownloading: false });
    });
  }

  componentDidMount() {
    // Component ready
  }

  handlePublicationClick = (name) => {
    pushToDataLayer('databoutique', 'datasetClick', { label: name });
  }

  openRetailConsumer = () => {
    const isRetailConsumerOpen = !this.state.isRetailConsumerOpen;
    this.setState({ isRetailConsumerOpen });
  }

  closeFailedModal = () => {
    this.setState({ isDownloadingFailed: false, isDownloading: false });
  }

  opModal = (type) => {
    this.setState({ isOpen: true, isCannabis: (type === 'cannabis') });
  }

  closeModal = () => {
    this.setState({ isOpen: false, isCannabis: false });
  }

  render() {
    const { data, profile, isLoggedIn } = this.props;
    const { isOpen, isCannabis } = this.state;
    const encodedTicker = encodeURIComponent(data.ticker);
    const url = '/library/?searchType=company&searchVal=';
    const toCompanyLink = (data.is_active && !data.hide ? `${url}${encodedTicker}&searchTicker=${encodedTicker}` : `${url}${encodedTicker}&searchTicker=${encodedTicker}&companyNotActive=1`);
    const canAccessContent = isLoggedIn && profile.can_access_content; // eslint-disable-line
    let roles = [];

    const tierMap = {
      tier1: data.tier_1 || false,
      tier2: data.tier_2 || false,
      tier3: data.tier_3 || false,
    };

    const triangleImage = getTriangleImage(tierMap);

    roles = data.analyst.roles.map((item) => {
      return (
        { name: item }
      );
    });

    const analystData = {
      ...data.analyst,
      roles,
      client_code: data.analyst.client_code
    };

    const isActive = (data.analyst.active === true && toShowAnalyst(analystData) && (!data.analyst.do_not_sync_to_rds));
    const message = data.entitlement_message;

    return (
      <div className="bmo-model-result-card">
        {
          this.state.isDownloadingFailed ?
            <DownloadFailedModal closeModal={this.closeFailedModal} text="BMO Models Download Unsuccessful" />
            :
            null
        }
        <div className="left">
          <div className="result-column date">
            {moment.utc(data.date).format('MM/DD/YYYY') || ''}
          </div>
          <div className="result-column ticker">
            <NavLink to={toCompanyLink} title={data.name}>
              {data.ticker || ''}
            </NavLink>
          </div>
          <div className="result-column author">
            {
              data.analyst ?
                <div className={'bmomodel-analyst-pop-up'}>
                  <Container
                    as={isActive ? NavLink : 'div'}
                    to={(isActive) ? `${config.analystURLPrefix}/${data.analyst.client_code}` : ''}
                  >
                    <Image
                      shape={'circular'}
                      alt={`${data.analyst ? data.analyst.display_name : ''} avatar`}
                      src={data.analyst.avatar_url || DEFAULT_PROFILE.img}
                      className={'author-profile-pic'}
                      onClick={this.openRetailConsumer}
                    />
                    <div className={'author-name'}>
                      {data.analyst.last_name}
                    </div>
                  </Container>
                  {isActive ?
                    <BmoPopUp
                      direction="horizontal-mid"
                      actLeftBuff={200}
                      rightPosBuff={30}
                      leftBuff={20}
                      topBuff={10}
                      hideController={'hover'}
                      showOnClick={false}
                    >
                      <RetailConsumerTeamCard
                        team={false}
                        canAccessContent={canAccessContent}
                        isOpen={this.state.isRetailConsumerOpen}
                        data={[analystData]}
                        canFollow={canAccessContent && profile && profile.can_follow_content}
                      />
                    </BmoPopUp>
                    :
                    null
                  }
                </div>
                :
                null
            }
            {
              data.analyst ?
                <Container
                  className={'mobile-view-author-name'}
                  as={isActive ? NavLink : 'div'}
                  to={isActive ? `${config.analystURLPrefix}/${data.analyst.client_code}` : ''}
                >
                  <div className={'mobile-author-name'}>{data.analyst ? data.analyst.display_name : ''} </div>
                </Container>
                : null
            }
          </div>
          <div className="result-column brand-triangle-tablet">
            {triangleImage ?
              <Image alt={'Brand-triabgle'} src={tierImageMap[triangleImage[0]]} className={'brand-triangle-icon'} />
              :
              ''
            }
          </div>
          <div className="result-column subject">
            <NavLink className={'subject-heading'} onClick={() => this.handlePublicationClick(data.name)} to={toCompanyLink}>
              <RichText richText={data.name} />
            </NavLink>
          </div>
          <div className="result-column user-pref only-desktop">
            {triangleImage ?
              <div className={'result-column triangle-image'}>
                <Image alt={'Brand-triabgle'} title={triangleImage[1]} src={tierImageMap[triangleImage[0]]} className={'brand-triangle-licon'} />
                <div className={'brand-text'} title={triangleImage[1]}>{triangleImage[1]}</div>
              </div>
              :
              <div className="result-column triangle-image" />
            }
            {data.show_download ?
              <Button
                title={'Download'}
                tabIndex={0}
                onClick={() => this.handleDownloadClick(data)}
                className={`user-pref-icon download-report ${this.state.isDownloading ? 'selected' : ''}`}
              />
              :
              <Button className={'ui button user-pref-icon cannabis-model lock-icon'} >
                <BmoPopUp
                  showOnClick={false}
                  showInToggleMode={true}
                  rightPosBuff={30}
                  hideController={'hover'}
                  direction="horizontal-mid"
                  strictDirection="left"
                  leftBuff={20}
                  topBuff={20}
                >
                  <CannabisPreviewModal message={message} />
                </BmoPopUp>
              </Button>
            }
          </div>
          <div className="result-column user-pref small-screen">
            {data.show_download ?
              <Button
                title={'Download'}
                tabIndex={0}
                onClick={() => this.handleDownloadClick(data)}
                className={`user-pref-icon download-report ${this.state.isDownloading ? 'selected' : ''}`}
              />
              :
              <Button
                title={'Download'}
                className={'ui button user-pref-icon cannabis-model lock-icon'}
                onClick={() => this.opModal('cannabis')}
              />
            }
          </div>
        </div>
        {isOpen &&
          <LibrarySearchResultOverlay
            isOpen={isOpen}
            message={message}
            isCannabis={isCannabis}
            isNotLibrary={true}
            closeModal={() => this.closeModal()}
            triangleImage={triangleImage}
          />
        }
        <div className="right" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: userSelector.getUserProfileInfo(state),
  isLoggedIn: userSelector.getIsLoggedIn(state),
});

const mapDispatchToProps = () => ({
  //
});

export default connect(mapStateToProps, mapDispatchToProps)(BmoModelResultCard);
