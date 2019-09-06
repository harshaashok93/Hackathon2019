/* @flow weak */

/*
 * Component: DatePicker
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import ReactDatePicker from 'react-date-picker';
import { Heading } from 'unchained-ui-react';
import { CALENDER_LOGO } from 'constants/assets';
import moment from 'moment';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './DatePicker.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class DatePicker extends Component {
  props: {
    datePickerTitle: '',
    onDateChange: () => void,
    datePickerId: '',
    date: '',
    dateRange: {},
    className: ''
  }

  static defaultProps = {
    date: moment().toDate(),
    datePickerTitle: '',
    onDateChange: () => {},
    datePickerId: 'from',
  };

  state = {
    date: '',
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ date: nextProps.date });
  }
  componentWillMount() {
    this.setState({ date: this.props.date });
  }
  componentDidMount() {
    const dateInputEls = document.querySelectorAll('.react-date-picker__button__input input[type="number"]');
    const dateInputMonths = document.querySelectorAll('.react-date-picker__button__input__month');
    const dateInputDays = document.querySelectorAll('.react-date-picker__button__input__day');
    if (dateInputEls && dateInputEls.length) {
      for (let i = 0; i < dateInputEls.length; i += 1) {
        dateInputEls[i].setAttribute('disabled', 'disabled');
      }
    }
    if (dateInputMonths && dateInputMonths.length) {
      for (let i = 0; i < dateInputMonths.length; i += 1) {
        if (dateInputMonths[i].value.length === 1 && dateInputMonths[i].value < 10) {
          dateInputMonths[i].value = `0${dateInputMonths[i].value}`;
        }
        if (dateInputDays[i].value.length === 1 && dateInputDays[i].value < 10) {
          dateInputDays[i].value = `0${dateInputDays[i].value}`;
        }
      }
    }
  }

  callOnChange = (value) => {
    const { onDateChange, datePickerId } = this.props;
    onDateChange(value, datePickerId);
    this.setState({
      date: value
    });
  }

  appendZero = (el) => {
    if (!el) return;
    const docEle = el;

    const value1 = (docEle[0] ? docEle[0].value : '');
    const value2 = (docEle[1] ? docEle[1].value : '');
    const value3 = (docEle[2] ? docEle[2].value : '');
    const value4 = (docEle[3] ? docEle[3].value : '');

    if (value1.length === 1 && value1 < 10) {
      docEle[0].value = `0${value1}`;
    }
    if (value2.length === 1 && value2 < 10) {
      docEle[1].value = `0${value2}`;
    }
    if (value3.length === 1 && value3 < 10) {
      docEle[2].value = `0${value3}`;
    }
    if (value4 && value4.length === 1 && value4 < 10) {
      docEle[3].value = `0${value4}`;
    }
  }

  formatMonthYear = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  componentDidUpdate() {
    this.appendZero(document.getElementsByClassName('react-date-picker__button__input__day'));
    this.appendZero(document.getElementsByClassName('react-date-picker__button__input__month'));
  }

  render() {
    const { datePickerTitle, dateRange, className } = this.props;
    const { date } = this.state;
    return (
      <div className={`date-picker ${className}`}>
        {
          datePickerTitle ?
            <Heading as={'span'} className="title-label date-picker-title" content={datePickerTitle} />
            :
            null
        }
        <ReactDatePicker
          value={new Date(date)}
          className={'react-date-picker'}
          locale="en-US"
          onChange={this.callOnChange}
          {...dateRange}
          nextLabel=""
          prevLabel=""
          calendarClassName="bmo-calender"
          calendarIcon={<img src={CALENDER_LOGO.img} alt={CALENDER_LOGO.alt} className="calender-icon" />}
          key={Math.random()}
          formatMonthYear={this.formatMonthYear}
        />
      </div>
    );
  }
}

export default DatePicker;
