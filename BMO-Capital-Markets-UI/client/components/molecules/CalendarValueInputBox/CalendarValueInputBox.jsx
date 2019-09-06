/* @flow weak */

/*
 * Component: CalendarValueInputBox
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { CALENDER_LOGO } from 'constants/assets';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './CalendarValueInputBox.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class CalendarValueInputBox extends Component {
  props: {
    apiCallOnDateChange: () => void,
    maxDate: '',
    minDate: '',
    actualValue: () => void,
    changeTheDate: () => void,
    openCal: () => void,
    toggleCal: () => void,
    isEnter: () => void,
  };

  static defaultProps = {
  };
  state = {
    actualValue: this.props.actualValue,
    maxDate: this.props.maxDate,
    minDate: this.props.minDate
  };
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.actualValue !== this.state.actualValue) {
      const DATE = new Date(nextProps.actualValue);
      const day = DATE.getDate();
      const month = DATE.getMonth() + 1;
      const year = DATE.getFullYear();
      this.setState({
        date: DATE,
        day: (day <= 9 ? `0${day}` : day),
        month: (month <= 9 ? `0${month}` : month),
        year,
        actualValue: nextProps.actualValue,
        minDate: nextProps.minDate,
        maxDate: nextProps.maxDate
      });
    }
  }
  componentWillMount = () => {
    const DATE = new Date(this.state.actualValue);
    const day = DATE.getDate();
    const month = DATE.getMonth() + 1;
    const year = DATE.getFullYear();
    this.setState({
      date: DATE,
      day: (day <= 9 ? `0${day}` : day),
      month: (month <= 9 ? `0${month}` : month),
      year
    });
  }
  dateChange = (type) => (e) => {
    const correctValue = e.target.value;
    if (type === 'day') {
      this.setState({ day: correctValue });
    } else if (type === 'month') {
      this.setState({ month: correctValue });
    } else if (type === 'year') {
      this.setState({ year: correctValue });
    }
    return 0;
  }
  chageDateAndApiCall = (theDate) => {
    const { apiCallOnDateChange, changeTheDate } = this.props;
    apiCallOnDateChange(theDate);
    changeTheDate(theDate);
  }
  componentDidMount() {
    document.addEventListener('click', this.onDocClick);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.onDocClick);
  }
  isAValidDate = (y, m, d) => {
    const year = parseInt(y, 10);
    const month = parseInt(m, 10) - 1;
    const day = parseInt(d, 10);
    const dt = new Date(year, month, day);
    if (dt.getFullYear() === year && dt.getMonth() === month && dt.getDate() === day) {
      return true;
    }
    return false;
  }
  dateBlur = (type) => () => {
    const { maxDate, minDate } = this.state;
    const date = new Date(this.state.date);
    const { day, month, year } = this.state;
    let correctValue = '';
    if (type === 'day') {
      correctValue = parseInt(day, 10);
      if (isNaN(correctValue) || correctValue <= 0) {
        correctValue = date.getDate();
      }
      if (correctValue <= 9) {
        correctValue = `0${correctValue}`;
      }
      let theDate = `${year}-${month}-${correctValue}`;
      if (!(this.isAValidDate(year, month, correctValue) && this.isInRange(maxDate, minDate, theDate))) {
        correctValue = date.getDate();
        if (correctValue <= 9) {
          correctValue = `0${correctValue}`;
        }
      }
      theDate = `${year}-${month}-${correctValue}`;
      this.setState({ day: correctValue, date: theDate }, this.chageDateAndApiCall(theDate));
    } else if (type === 'month') {
      correctValue = parseInt(month, 10);
      if (isNaN(correctValue) || correctValue <= 0) {
        correctValue = date.getMonth() + 1;
      }
      if (correctValue <= 9) {
        correctValue = `0${correctValue}`;
      }
      let theDate = `${year}-${correctValue}-${day}`;
      if (!(this.isAValidDate(year, correctValue, day) && this.isInRange(maxDate, minDate, theDate))) {
        correctValue = date.getMonth() + 1;
        if (correctValue <= 9) {
          correctValue = `0${correctValue}`;
        }
      }
      theDate = `${year}-${correctValue}-${day}`;
      this.setState({ month: correctValue, date: theDate }, this.chageDateAndApiCall(theDate));
    } else if (type === 'year') {
      correctValue = parseInt(year, 10);
      if (isNaN(correctValue) || correctValue <= 0) {
        correctValue = date.getFullYear();
      }
      let theDate = `${correctValue}-${month}-${day}`;
      if (!(this.isAValidDate(correctValue, month, day) && this.isInRange(maxDate, minDate, theDate))) {
        correctValue = date.getFullYear();
      }
      theDate = `${correctValue}-${month}-${day}`;
      this.setState({ year: correctValue, date: theDate }, this.chageDateAndApiCall(theDate));
    }
  }
  isInRange = (maxDate, minDate, toCheck) => {
    let maxD = new Date(maxDate);
    maxD = maxD.setHours(0, 0, 0, 0);

    let minD = new Date(minDate);
    minD = minD.setHours(0, 0, 0, 0);

    let toCheckD = new Date(toCheck);
    toCheckD = toCheckD.setHours(0, 0, 0, 0);

    if (!isNaN(maxD) && (maxD - toCheckD) < 0) {
      return false;
    }
    if (!isNaN(minD) && (toCheckD - minD) < 0) {
      return false;
    }
    return true;
  }
  render() {
    const { openCal, toggleCal, isEnter } = this.props;
    return (
      <div className="calender-input-btns">
        <div
          className="calender-input"
          onClick={openCal}
          onKeyPress={() => {}}
          tabIndex={0}
          role="button"
        >
          <input
            className="dateInput"
            type="number"
            value={this.state.month}
            onKeyUp={isEnter}
            onChange={this.dateChange('month')}
            onBlur={this.dateBlur('month')}
          />
          <span>/</span>
          <input
            className="dateInput"
            type="number"
            value={this.state.day}
            onKeyUp={isEnter}
            onChange={this.dateChange('day')}
            onBlur={this.dateBlur('day')}
          />
          <span>/</span>
          <input
            className="dateInput dateYear"
            type="number"
            value={this.state.year}
            onChange={this.dateChange('year')}
            onKeyUp={isEnter}
            onBlur={this.dateBlur('year')}
          />
        </div>
        <div
          className="calendar-icon-holder"
          onClick={toggleCal}
          onKeyUp={isEnter}
          tabIndex={0}
          htmlFor="calender-close"
          role="button"
        >
          <img
            htmlFor="calender-close"
            src={CALENDER_LOGO.img}
            alt={CALENDER_LOGO.alt}
            className="calendar-icon"
          />
        </div>
      </div>
    );
  }
}

export default CalendarValueInputBox;
