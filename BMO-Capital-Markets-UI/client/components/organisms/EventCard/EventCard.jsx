/* @flow weak */
/*
 * Component: EventCard
 */
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Heading, Button, Modal, Input, Icon } from 'unchained-ui-react';
import { ContactUsForm, DatePicker } from 'components';
import { pushToDataLayer } from 'analytics';
import { connect } from 'react-redux';
import moment from 'moment';
import st from 'constants/strings';
import {
  uploadFile
} from 'api/utils';
import {
  userSelector
} from 'store/selectors';
import {
  SET_USER_CALENDAR_EVENTS,
  RESET_BOOKMARK_CALENDAR_EVENT
} from 'store/actions';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { EVENT_CARD } from 'constants/assets';
import './EventCard.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class EventCard extends Component {
  props: {
    isLoggedIn: Boolean,
    eventInformation: {},
    index: number,
    pageName: '',
    status: '',
    sfId: '',
    profile: {},
    reqPara: {},
    eventBookmarkId: [],
    refreshPublishedEvents: () => void,
    updateBookmarksData: () => void,
    removeBookmarksData: () => void,
    resetUserEventList: () => void,
    allUserEvents: [],
    resetCalendarEventList: () => void,
  };
  static defaultProps = {
    isLoggedIn: true,
    eventInformation: {
      eventCardImage: ((window.unchainedSite && window.unchainedSite.DefaultImages && window.unchainedSite.DefaultImages.events_conferences_cms_image) || EVENT_CARD.img),
      type: 'Conference',
      date: '07/21/17',
      title: '12th Annual Real Estate Conference',
      topic: 'Real Estate',
      place: 'Chicago, Illinois',
      availability: true,
    },
    pageName: '',
    status: 'Request Info',
  };
  state = {
    isOpenConferenceOverlay: false,
    responseStatusVal: false,
    openAdminEventModal: false,
    inputFields: {
      title: '',
      sf_id: '',
      location: '',
      presenter: '',
      eventId: ''
    },
    eventDate: moment().format('YYYY-MM-DD'),
    status: '',
  }
  componentDidMount() {
    // Component ready
  }
  componentWillMount() {
    let status = '';
    const statusProps = this.props.status;
    switch (statusProps) {
      case 'Attend' :
        status = 'Request Info';
        break;
      case '' :
        status = 'Request Info';
        break;
      case 'Attending':
        status = 'Requested';
        break;
      default: break;
    }
    const { eventInformation, sfId } = this.props;
    let inputFields = {
      title: '',
      sf_id: '',
      eventId: '',
      location: '',
      presenter: '',
      image: '',
    };
    if (eventInformation) {
      inputFields = {
        title: eventInformation.title,
        sf_id: sfId,
        location: eventInformation.place,
        presenter: eventInformation.presenter,
        image: eventInformation.eventCardImage,
        eventDate: moment(eventInformation.date).format('YYYY-MM-DD'),
        eventId: eventInformation.eventId
      };
    }
    this.setState({ status, inputFields });
  }
  componentWillReceiveProps(nextProps) {
    let status = '';
    const statusProps = nextProps.status;
    switch (statusProps) {
      case 'Attend' :
        status = 'Request Info';
        break;
      case '' :
        status = 'Request Info';
        break;
      case 'Attending':
        status = 'Requested';
        break;
      default: break;
    }
    const { eventInformation, sfId } = nextProps;
    let inputFields = {
      title: '',
      sf_id: '',
      eventId: '',
      location: '',
      presenter: '',
      image: '',
    };
    if (eventInformation) {
      inputFields = {
        title: eventInformation.title,
        sf_id: sfId,
        location: eventInformation.place,
        presenter: eventInformation.presenter,
        image: eventInformation.eventCardImage,
        eventDate: moment(eventInformation.date).format('YYYY-MM-DD'),
        eventId: eventInformation.eventId
      };
    }
    this.setState({ status, inputFields });
  }
  closeContactUsForm = () => {
    document.body.style.overflow = '';
    this.setState({ isOpenConferenceOverlay: false });
  }
  closeConferenceSuccessPopup = () => {
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll-thank');
    this.setState({ responseStatusVal: false });
  }
  closeConferenceMsgPopup = () => () => {
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll-thank');
    this.setState({ responseStatusVal: false });
    const { allUserEvents } = this.props;
    const { inputFields } = this.state;
    allUserEvents.map((item) => {
      const itemValue = item;
      if (item.id === inputFields.eventId) {
        itemValue.user_status = 'Attending';
      }
    });
    this.props.resetUserEventList(allUserEvents);
    this.props.resetCalendarEventList(inputFields.eventId);
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
  openOnClickAdminEventModal = () => () => {
    document.body.style.overflow = 'hidden';
    this.setState({ openAdminEventModal: true });
  }
  closeAdminEventModal = () => {
    document.body.style.overflow = '';
    this.setState({ openAdminEventModal: false });
  }
  handleDateChange = (name, value) => {
    const { inputFields } = this.state;
    inputFields[name] = moment(value).format('YYYY-MM-DD');
    this.setState({ inputFields });
  }
  handleInputChange = (type) => (e) => {
    const { inputFields } = this.state;
    inputFields[type] = e.target.value;
    this.setState({ inputFields });
  }
  triggerFileUpload = () => () => {
    const fileBtn = document.getElementById('file_upload');
    fileBtn.click();
  }
  handleEventBookmarkClick = (id, eventName) => {
    const { eventBookmarkId } = this.props;
    if (eventBookmarkId.indexOf(id) === -1) {
      this.props.updateBookmarksData({ eventID: id });
    } else {
      this.props.removeBookmarksData({ eventID: id });
    }
    const analystInfo = this.props.profile;
    const data = { analystName: `${analystInfo.first_name} ${analystInfo.last_name}`, activeFilters: this.props.reqPara };
    pushToDataLayer('profile', 'requestForEvent', { category: 'Profile Calender', action: 'Bookmark Event', label: eventName, data });
  }
  saveAdminEdit = async () => {
    const { inputFields } = this.state;
    const { eventInformation } = this.props;
    const reqParameter = {
      event_title: inputFields.title.trim(),
      salesforce_id: inputFields.sf_id.trim(),
      location: inputFields.location.trim(),
      presenter: inputFields.presenter.trim(),
      id: eventInformation.eventId,
      event_date: moment(inputFields.eventDate.trim()).format('YYYY-MM-DD'),
    };
    const fileBtn = document.getElementById('file_upload');
    const result = await uploadFile(fileBtn, reqParameter, '/user_moderation/get_published_events/');
    if (result.data.message) {
      this.props.refreshPublishedEvents();
      this.setState({ openAdminEventModal: false });
      document.body.style.overflow = '';
    }
  }
  render() {
    const { isLoggedIn, eventInformation, index, pageName, sfId, eventBookmarkId } = this.props;
    const mountPoint = document.getElementById('bmo-footer');
    const { isOpenConferenceOverlay, responseStatusVal, openAdminEventModal, inputFields, status } = this.state;
    const mountPointConference = document.getElementById(`event-card-${index}`);
    const eventsConferencesCmsImage = eventInformation.eventCardImage || (window.unchainedSite && window.unchainedSite.DefaultImages && window.unchainedSite.DefaultImages.events_conferences_cms_image) || EVENT_CARD.img;
    const data = {
      event: eventInformation.type,
      date: eventInformation.date,
      title: eventInformation.title,
      info: 'Availability is limited. Please contact us for details. ',
      sfId,
      presenter: eventInformation.presenter,
      eventId: eventInformation.eventId,
    };
    if (responseStatusVal) {
      document.body.classList.add('noscroll-thank');
    }
    return (
      <div className="event-card" id={`event-card-${index}`}>
        <div className={'left'}>
          <div className={'event-card-image'}>
            <Image src={eventsConferencesCmsImage} alt={'event card image'} className={'event-card-side-image'} />
          </div>
          <div className={'event-details'}>
            <div className={'type-location'}>
              <span>{eventInformation.type}</span>
              {eventInformation.type && <div className={'seperator-dot'}>{' • '}</div>}
              <span>{eventInformation.date}</span>
            </div>
            <Heading as={'h5'} content={eventInformation.title} />
            <div className={'type-location'}>
              <span>{eventInformation.place}</span>
            </div>
            {pageName === 'admin-event-card' &&
              <div className={'presenter'}>
                <span>{`Presenter ${eventInformation.presenter}`}</span>
              </div>
            }
            {pageName !== 'admin-event-card' && (
              <Button secondary disabled={status === 'Requested'} className={'attend-button'} content={status} onClick={this.openConferenceOverlay()} />
            )}
          </div>
          {(isLoggedIn && pageName !== 'admin-event-card') && <div className={'user-profile-event'}><Button className={`blue-bookmark ${eventBookmarkId.indexOf(eventInformation.eventId) > -1 ? 'selected' : ''}`} title={st.bookmark} onClick={() => this.handleEventBookmarkClick(eventInformation.eventId, eventInformation.title)} /></div> }
          {pageName === 'admin-event-card' &&
            <div className={'edit-btn'}>
              <Button secondary className={''} content={'Edit'} onClick={this.openOnClickAdminEventModal()} />
            </div>
          }
        </div>
        <div className={'right'}>
          {(isLoggedIn && pageName !== 'admin-event-card') && <Button className={`blue-bookmark ${eventBookmarkId.indexOf(eventInformation.eventId) > -1 ? 'selected' : ''}`} title={st.bookmark} onClick={() => this.handleEventBookmarkClick(eventInformation.eventId, eventInformation.title)} /> }
        </div>
        {responseStatusVal &&
          <Modal
            dimmer={true}
            className="popup-conference-success"
            closeOnEscape={true}
            open={responseStatusVal}
            onClose={() => this.closeConferenceMsgPopup()}
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
        {isOpenConferenceOverlay &&
          <ContactUsForm
            contactUsFormType={'conference'}
            eventConference={data}
            isContactUsFormOpen={isOpenConferenceOverlay}
            closeContactUsForm={this.closeContactUsForm}
            sendResponseStatus={this.responseStatus()}
            mountPoint={mountPoint}
            reqPara={this.props.reqPara}
          />
        }
        {openAdminEventModal &&
          <Modal
            dimmer={true}
            className="admin-edit-publish-modal"
            open={openAdminEventModal}
            mountNode={mountPointConference}
            onClose={() => this.closeAdminEventModal()}
          >
            <Modal.Header>
              <div className="close-image">
                <Button tabIndex={0} className="bmo-close-btn" onClick={() => this.closeAdminEventModal()} aria-label="Close Modal" />
              </div>
            </Modal.Header>
            <Modal.Content>
              <div className={''}>
                <Heading className={'cms-heading'} as={'h3'} content={'CMS'} />
                <span>{'Title'}</span>
                <Input input={{ value: inputFields.title, onChange: this.handleInputChange('title') }} />
                <div className={'image-date-overlay'}>
                  <div className={'image-overlay'}>
                    <span>{'Image'}</span>
                    <div className={'event-card-image'}>
                      <Image src={eventsConferencesCmsImage} alt={'event card image'} className={'event-card-side-image'} />
                      <Button className={'linkBtn pencil'} onClick={this.triggerFileUpload()} icon title={st.upload}>
                        <Icon name={'pencil'} />
                      </Button>
                      <input className={'file-upload-input'} type="file" id="file_upload" />
                    </div>
                  </div>
                  <div className={'date-overlay'}>
                    <span>{'Date'}</span>
                    <div className={'event-date'}>
                      <DatePicker
                        onDateChange={(dt) => this.handleDateChange('eventDate', dt)}
                        date={inputFields.eventDate}
                      />
                    </div>
                  </div>
                </div>
                <span>{'Location'}</span>
                <Input input={{ value: inputFields.location, onChange: this.handleInputChange('location') }} />
                <span>{'Presenter'}</span>
                <Input input={{ value: inputFields.presenter, onChange: this.handleInputChange('presenter') }} />
                <span>{'Sales Force Id'}</span>
                <Input input={{ value: inputFields.sf_id, onChange: this.handleInputChange('sf_id') }} />
                <div className={'action-buttons'}>
                  <Button secondary content={'Cancel'} onClick={() => this.closeAdminEventModal()} />
                  <Button secondary content={'Save'} onClick={this.saveAdminEdit} />
                </div>
              </div>
            </Modal.Content>
          </Modal>
        }
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  profile: userSelector.getUserProfileInfo(state),
  allUserEvents: userSelector.getUserEvents(state),
});

const mapDispatchToProps = (dispatch) => ({
  resetUserEventList: (data) => {
    dispatch({ type: SET_USER_CALENDAR_EVENTS, data: Object.assign([], data) });
  },
  resetCalendarEventList: (eventId) => {
    dispatch(RESET_BOOKMARK_CALENDAR_EVENT(eventId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EventCard);
