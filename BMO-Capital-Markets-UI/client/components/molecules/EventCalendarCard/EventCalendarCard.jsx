/* @flow weak */

/*
 * Component: EventCalendarCard
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Modal, Input, Heading } from 'unchained-ui-react';
import { DatePicker } from 'components';
import moment from 'moment';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './EventCalendarCard.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class EventCalendarCard extends Component {
  props: {
    data: {},
    publishEvent: () => void,
  };

  static defaultProps = {
  };

  state = {
    publishModalOpen: false,
    eventDate: moment().format('YYYY-MM-DD'),
    inputFields: {
      title: '',
      sf_id: '',
      location: '',
      presenter: '',
      status: '',
    },
  }

  componentDidMount() {
    // Component ready
  }

  componentWillMount() {
    const { data } = this.props;
    let inputFields = {
      title: '',
      sf_id: '',
      location: '',
      presenter: ''
    };

    if (data) {
      inputFields = {
        title: data.event_title,
        sf_id: data.salesforce_id,
        location: data.location,
        presenter: data.presenter,
      };
    }
    this.setState({ inputFields, status: data.publish_status });
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    this.setState({ status: data.publish_status });
  }

  openPublishModal = () => () => {
    document.body.style.overflow = 'hidden';
    this.setState({ publishModalOpen: true });
  }

  closePublishModal = () => {
    document.body.style.overflow = '';
    this.setState({ publishModalOpen: false });
  }

  onClickPublish = () => () => {
    const { inputFields } = this.state;
    const { data } = this.props;
    const dataParam = {
      event_title: inputFields.title.trim(),
      salesforce_id: inputFields.sf_id.trim(),
      location: inputFields.location.trim(),
      presenter: inputFields.presenter.trim(),
      id: data.id,
    };
    this.props.publishEvent(dataParam);
    document.body.style.overflow = '';
    this.setState({ status: 'Published', publishModalOpen: false });
  }

  handleDateChange = (value) => {
    this.setState({ eventDate: moment(value).format('YYYY-MM-DD') });
  }

  handleInputChange = (type) => (e) => {
    const { inputFields } = this.state;
    inputFields[type] = e.target.value;
    this.setState({ inputFields });
  }

  renderPublishModal = () => {
    const { publishModalOpen, eventDate, inputFields } = this.state;
    return (
      <Modal
        open={publishModalOpen}
        onClose={() => this.closePublishModal()}
        mountNode={document.getElementById('eventCalendarForm')}
        className={'publish-modal-edit'}
        closeOnRootNodeClick={false}
      >
        <Modal.Content>
          <div className={''}>
            <Heading className={'cms-heading'} as={'h3'} content={'Sales Force'} />
            <span>{'Title'}</span>
            <Input input={{ value: inputFields.title, onChange: this.handleInputChange('title') }} />

            <span>{'Sales Force Id'}</span>
            <Input input={{ value: inputFields.sf_id, onChange: this.handleInputChange('sf_id') }} />

            <span>{'Date'}</span>
            <div className={'event-date'}>
              <DatePicker
                onDateChange={(dt) => this.handleDateChange(dt)}
                date={eventDate}
              />
            </div>

            <span>{'Location'}</span>
            <Input input={{ value: inputFields.location, onChange: this.handleInputChange('location') }} />

            <span>{'Presenter'}</span>
            <Input input={{ value: inputFields.presenter, onChange: this.handleInputChange('presenter') }} />

            <Heading as={'h3'} content={'Would you like to publish this Sales Force event to the CMS?'} />
            <div className={'action-buttons'}>
              <Button secondary className="cancel-button" content={'Cancel'} onClick={() => this.closePublishModal()} />
              <Button secondary content={'Publish'} onClick={this.onClickPublish()} />
            </div>
          </div>
        </Modal.Content>
      </Modal>
    );
  }

  render() {
    const { data } = this.props;
    const { status } = this.state;
    return (
      <div id="eventCalendarForm" className="event-calendar-card">
        <div className={'row event-id'}>
          <span>{`Event ${data.salesforce_id}`}</span>
        </div>
        <div className={'row event-details'}>
          <span className={'id'} >{data.id}</span>
          <span className={'title'} >{data.event_title}</span>
          <span className={'topic'} >{data.event_type}</span>
          <span className={'location'} >{data.location}</span>
          <span className={'presenter'} >{data.presenter || ''}</span>
        </div>
        <div className={'row event-action'}>
          {status === 'Published' && <span className="published-text">{'Published'}</span>}
          {status === 'recent' &&
            <div>
              <span className={'recently-updated'}>{'Recently Updated'}</span>
              <span className={'hover-help'}>?</span>
            </div>
          }
          {status === 'Publish' &&
            <div className={'publish-btn'}>
              <Button secondary className={'publish-button'} content={'Publish'} onClick={this.openPublishModal()} />
            </div>
          }
        </div>
        {this.renderPublishModal()}
      </div>
    );
  }
}

export default EventCalendarCard;
