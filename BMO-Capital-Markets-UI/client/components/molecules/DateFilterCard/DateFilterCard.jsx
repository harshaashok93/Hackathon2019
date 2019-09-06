/* @flow weak */

/*
 * Component: DateFilterCard
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { DatePicker } from 'components';
import { Label } from 'unchained-ui-react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './DateFilterCard.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class DateFilterCard extends Component {
  props: {
    dateText: '',
    fromDate: '',
    toDate: '',
    handleDateChange: () => void,
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  handleDateChange = (key, value) => {
    const { handleDateChange } = this.props;
    if (handleDateChange) {
      handleDateChange(key, value);
    }
  }

  render() {
    const { dateText, fromDate, toDate } = this.props;
    const targetToDate = `${toDate}T00:00:00`;
    const targetFromDate = `${fromDate}T00:00:00`;

    return (
      <div className="date-filter-card">
        <Label as={'button'} content={dateText} className={'filter-name'} />
        <DatePicker
          datePickerTitle={'From'}
          dateRange={{ maxDate: new Date(targetToDate) }}
          onDateChange={(dt) => this.handleDateChange('fromDate', dt)}
          date={targetFromDate}
        />
        <DatePicker
          datePickerTitle={'To'}
          dateRange={{ minDate: new Date(targetFromDate) }}
          onDateChange={(dt) => this.handleDateChange('toDate', dt)}
          date={targetToDate}
        />
      </div>
    );
  }
}

export default DateFilterCard;
