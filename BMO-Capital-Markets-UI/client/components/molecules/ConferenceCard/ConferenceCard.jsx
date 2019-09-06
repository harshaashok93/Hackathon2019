/* @flow weak */

/*
 * Component: ConferenceCard
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Heading, Button, Modal } from 'unchained-ui-react';
import { EVENT_CARD } from 'constants/assets';
import { ContactUsForm } from 'components';
import moment from 'moment';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ConferenceCard.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ConferenceCard extends Component {
  props: {
    status: '',
    eventInformation: {},
    eventBookmarkId: [],
    updateBookmarksData: () => void,
    removeBookmarksData: () => void,
    isLoggedIn: bool,
    canBookmark: bool,
  }

  static defaultProps = {
  }

  state = {
    isOpenConferenceOverlay: false,
    responseStatusVal: false,
    status: 'Attend',
    cardIdx: Math.random()
  }

  componentDidMount() {
    // Component ready
  }

  componentWillMount() {
    let status = 'Attend';
    const statusProps = this.props.status;
    switch (statusProps) {
      case 'Attend' :
        status = 'Attend';
        break;
      case '' :
        status = 'Attend';
        break;
      case 'Attending':
        status = 'Requested';
        break;
      default: break;
    }
    this.setState({ status });
  }

  closeContactUsForm = () => {
    document.body.style.overflow = '';
    this.setState({ isOpenConferenceOverlay: false });
  }

  closeConferenceSuccessPopup = () => () => {
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll-thank');
    this.setState({ responseStatusVal: false });
  }

  closeConferenceMsgPopup = () => () => {
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll-thank');
    this.setState({ responseStatusVal: false });
  }

  openConferenceOverlay = () => () => {
    document.body.style.overflow = 'hidden';
    this.setState({ isOpenConferenceOverlay: true });
  }

  responseStatus = () => (responseStatusVal) => {
    if (responseStatusVal) {
      this.setState({ status: 'Requested' });
    }
    this.setState({ responseStatusVal });
  }

  handleEventBookmarkClick = (sfid) => {
    const { eventBookmarkId } = this.props;
    if (eventBookmarkId.indexOf(sfid) === -1) {
      this.props.updateBookmarksData({ salesforce_id: sfid });
    } else {
      this.props.removeBookmarksData({ salesforce_id: sfid });
    }
  }

  render() {
    const { status, isOpenConferenceOverlay, responseStatusVal, cardIdx } = this.state;
    const { isLoggedIn, eventInformation, canBookmark, eventBookmarkId } = this.props;
    const mountPoint = document.getElementById('bmo-footer');
    const mountPointConference = document.getElementById(`event-card-${cardIdx}`);
    const eventsConferencesCmsImage = eventInformation.eventCardImage || (window.unchainedSite && window.unchainedSite.DefaultImages && window.unchainedSite.DefaultImages.events_conferences_cms_image) || EVENT_CARD.img;
    const data = {
      event: eventInformation.type,
      date: eventInformation.date,
      title: eventInformation.title,
      info: 'Availability is limited. Please contact us for details. ',
      sfId: eventInformation.eventId,
      presenter: eventInformation.presenter || '',
    };

    if (responseStatusVal) {
      document.body.classList.add('noscroll-thank');
    }

    return (
      <div className="conference-card" id={`event-card-${cardIdx}`}>
        <div className={'event-card-image'}>
          <Image src={eventsConferencesCmsImage} alt={'event card image'} className={'event-card-side-image'} />
        </div>
        <div className={'bottom-wrap'}>
          <div className={'left'}>
            <div className={'type-location'}>
              <span>{eventInformation.type}</span>
              <div className={'seperator-dot'}>{' • '}</div>
              <span>{moment(eventInformation.date).format('MM/DD/YYYY')}</span>
            </div>
            <Heading as={'h5'} content={eventInformation.title} />
            <div className={'topic-location'}>
              <span>{eventInformation.place}</span>
            </div>
          </div>
          <div className={'right'}>
            {isLoggedIn && canBookmark && <Button className={`blue-bookmark ${eventBookmarkId.indexOf(data.sfId) > -1 ? 'selected' : ''}`} onClick={() => this.handleEventBookmarkClick(data.sfId)} /> }
          </div>
          <div className={'attend-btn'}>
            <Button secondary disabled={status === 'Requested'} className={'attend-button'} content={status} onClick={this.openConferenceOverlay()} />
          </div>
        </div>
        {isOpenConferenceOverlay &&
          <ContactUsForm
            contactUsFormType={'conference'}
            eventConference={data}
            isContactUsFormOpen={isOpenConferenceOverlay}
            closeContactUsForm={this.closeContactUsForm}
            sendResponseStatus={this.responseStatus()}
            mountPoint={mountPoint}
          />
        }
        {responseStatusVal &&
          <Modal
            dimmer={false}
            className="popup-conference-success"
            closeOnEscape={true}
            open={responseStatusVal}
            onClose={this.closeConferenceSuccessPopup()}
            mountNode={mountPointConference}
            closeOnRootNodeClick={false}
          >
            <Modal.Header>
              <div className="close-image">
                <Button tabIndex={0} className="bmo-close-btn" onClick={this.closeConferenceMsgPopup()} aria-label="Close Modal" />
              </div>
            </Modal.Header>
            <Modal.Content>
              <Heading as={'h3'} content={'Thank you, your request has been submitted. You will be notified by email about availability. '} />
            </Modal.Content>
            <Modal.Actions className={'welcomeScreenActionBtns'}>
              <Button secondary content={'Close'} onClick={this.closeConferenceMsgPopup()} />
            </Modal.Actions>
          </Modal>
        }
      </div>
    );
  }
}

export default ConferenceCard;
