/* @flow weak */

/*
 * Component: YouAreAttendingCard
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Button } from 'unchained-ui-react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './YouAreAttendingCard.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class YouAreAttendingCard extends Component {
  props: {
    cardTitle: '',
    imageUrl: '',
    eventType: '',
    eventTitle: '',
    eventCategory: '',
    eventDate: '',
    actionButtonText: '',
    className: ''
  };

  static defaultProps = {
    imageUrl: '',
    eventType: 'Real Estate',
    eventTitle: '12th Annual Real Estate Conference',
    eventCategory: 'General Event',
    eventDate: '07/21/17',
    actionButtonText: 'Attend',
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const {
      cardTitle,
      imageUrl,
      eventTitle,
      eventType,
      eventCategory,
      eventDate,
      actionButtonText,
      className
    } = this.props;
    return (
      <div className={`you-are-attending-card ${className}`}>
        {
          cardTitle ?
            <div className="blue-title-bar">
              {cardTitle}
            </div>
            : null
        }
        <div className="card-content">
          <div className="sideLeft">
            <div className="event-image">
              <Image src={imageUrl} />
            </div>
            <div className="event-info">
              <div className="event-category-and-date">
                <div className="event-category">
                  {eventCategory}
                </div>
                <span className="dot">•</span>
                <div className="event-date">
                  {eventDate}
                </div>
              </div>
              <div className="event-title">
                {eventTitle}
              </div>
              <div className="event-type-and-place">
                <span className="event-type">{eventType}</span>
                <span className="dot">•</span>
                <span className="event-place">{eventType}</span>
              </div>
              <div className="event-action-button">
                <Button secondary> {actionButtonText} </Button>
              </div>
            </div>
          </div>
          <div className="sideRight">
            <div className="button-and-bookmark">
              <div className="blue-bookmark event-book-mark-flag" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default YouAreAttendingCard;
