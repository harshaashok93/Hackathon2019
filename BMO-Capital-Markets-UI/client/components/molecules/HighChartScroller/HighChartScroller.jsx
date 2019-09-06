/* @flow weak */

/*
 * Component: HighChartScroller
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import ReactSlider from 'react-slider';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './HighChartScroller.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class HighChartScroller extends Component {
  props: {
    maxVal: number,
    summaryTipWidth: number,
    minVal: number,
    oneUnit: number,
    data: [],
    coverHeight: ''
  };

  static defaultProps = {
  };
  state = {
    selVal: 'computing...',
    maxVal: 10,
    summaryTipTop: '-60px',
    sliderCirclePos: '-50%',
    coverLayerWidth: 0,
    slideHighlightWidth: 0,
    summaryTipPos: '',
    sliderValue: 0,
    stockValueByDate: {},
  };
  getFirstpoint = (data) => {
    if (!data) {
      return 'computing ...';
    }
    const summDate = new Date(data.x);
    const month = summDate.toLocaleString('en-us', { month: 'long' });
    const day = summDate.getUTCDate();
    const year = summDate.getYear() + 1900;
    const date = `${month.replace(/[^ -~]/g, '').substr(0, 3)} ${day} ${year}`;
    return `${date} $${data.y} Vol.${this.moneyFormats(data.volume)}`;
  }
  componentWillMount() {
    const maxVal = (this.props.maxVal - this.props.minVal) / this.props.oneUnit;
    this.setStockValByDates(this.props.data);
    const firstPoint = this.getFirstpoint(this.props.data[0]);
    this.setState({
      maxVal,
      summaryTipPos: `-${this.props.summaryTipWidth - 25}px`,
      minVal: this.props.minVal,
      coverLayerWidth: 0,
      slideHighlightWidth: 0,
      dataPoints: this.props.data,
      sliderCirclePos: '-50%',
      sliderValue: 0,
      selVal: firstPoint
    });
  }
  componentWillReceiveProps(nextProps) {
    const maxVal = (nextProps.maxVal - nextProps.minVal) / nextProps.oneUnit;
    const firstPoint = this.getFirstpoint(nextProps.data[0]);
    this.setStockValByDates(nextProps.data);
    this.setState({
      maxVal,
      summaryTipPos: '',
      minVal: nextProps.minVal,
      coverLayerWidth: 0,
      slideHighlightWidth: 0,
      dataPoints: nextProps.data,
      sliderCirclePos: '-50%',
      sliderValue: 0,
      showSummary: false,
      selVal: firstPoint
    });
  }
  componentDidMount() {
    document.body.addEventListener('click', this.hideSummary);
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.hideSummary);
  }
  getTimeStamp = (theDate) => {
    const month = theDate.getMonth();
    const date = theDate.getDate();
    const year = theDate.getYear();
    const stamp = `${year}-${month}-${date}`;
    return stamp;
  }
  setStockValByDates = (data) => {
    const stockVals = {};
    data.map(aDay => {
      const day = new Date(aDay.x);
      stockVals[this.getTimeStamp(day)] = { stockVal: aDay.y, volume: aDay.volume };
    });
    this.setState({ stockValueByDate: stockVals }, this.sliderChange(0));
  }
  moneyFormats = (labelValue) => {
    if (!labelValue) return '';
    if (Math.abs(Number(labelValue)) >= 1.0e+9) {
      return `${Number(Math.abs(Number(labelValue)) / 1.0e+9).toFixed(1)}B`;
    } else if (Math.abs(Number(labelValue)) >= 1.0e+6) {
      return `${Number(Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1)}M`;
    } else if (Math.abs(Number(labelValue)) >= 1.0e+3) {
      return `${Number(Math.abs(Number(labelValue)) / 1.0e+3).toFixed(1)}K`;
    } return Math.abs(Number(labelValue));
  }
  sliderChange = (val) => {
    const { maxVal, minVal, stockValueByDate } = this.state;
    const startDay = new Date(minVal);
    const summaryTipWidth = (this.props.summaryTipWidth || 250) - 25;
    const width = `${(val / maxVal) * 100}%`;
    const circlePos = `${-50 + ((val / maxVal) * 100)}%`; // lim 0->50 : df(x)/dx | Amar J. Kachari
    const summaryTipPos = `${-1 * (summaryTipWidth - ((val / maxVal) * summaryTipWidth))}px`; // lim 0->50 : df(x)/dx | Amar J. Kachari

    const dateInNumber = new Date(startDay.setDate(startDay.getDate() + val));
    const timeStamp = this.getTimeStamp(dateInNumber);
    const month = dateInNumber.toLocaleString('en-us', { timeZone: 'UTC', month: 'long' }).replace(/[^ -~]/g, '').substring(0, 3);
    const day = dateInNumber.getUTCDate();
    const year = dateInNumber.getUTCFullYear();

    const stockVal = stockValueByDate[timeStamp] ? stockValueByDate[timeStamp].stockVal : null;
    const vol = this.moneyFormats(stockValueByDate[timeStamp] ? stockValueByDate[timeStamp].volume : null);
    this.setState({
      selVal: {
        date: `${month} ${day} ${year}`,
        stockVal: `$${stockVal}`,
        stockVolume: `Vol. ${vol}`
      },
    });
    this.setState({
      sliderValue: val,
      coverLayerWidth: width,
      slideHighlightWidth: width,
      sliderCirclePos: circlePos,
      summaryTipPos
    });
  }
  showSummary = () => {
    this.setState({ showSummary: true });
  }
  hideSummary = () => {
    this.setState({ showSummary: false });
  }

  render() {
    const {
      selVal,
      coverLayerWidth,
      slideHighlightWidth,
      summaryTipPos,
      showSummary,
      maxVal,
      sliderCirclePos
    } = this.state;
    const { coverHeight } = this.props;
    return (
      <div className="high-chart-scroller">
        <div className="cover-div-holder">
          <div className="cover-div" style={{ width: coverLayerWidth, height: coverHeight }} />
          <div className="slide-amount-highlighter-wrapper">
            <div className="slide-amount-highlighter" style={{ width: slideHighlightWidth }} />
          </div>
          <ReactSlider
            min={0}
            max={maxVal}
            withBars
            value={this.state.sliderValue}
            className="highchartsSlider"
            onChange={this.sliderChange}
          >
            <div className="handler">
              <div id="summary-tip" className={showSummary ? 'summary-tip' : 'hidden'} style={{ right: summaryTipPos }}>
                {
                  typeof selVal === 'string' ? selVal :
                    (
                      <span className="scroller-content">
                        <span className="date">{selVal.date}</span>
                        <span className="stockVal">{selVal.stockVal}</span>
                        <span className="stockVolume">{selVal.stockVolume}</span>
                      </span>
                    )
                }
              </div>
              <span className={showSummary ? 'triangle' : 'hidden'} />
              <div
                className={`highcharts-scroll-handler ${sliderCirclePos === '-50%' ? 'mobileleft' : ''}`}
                role="button"
                tabIndex={0} onKeyPress={() => {}}
                style={{ left: sliderCirclePos }}
                onMouseDown={this.showSummary}
                onClick={this.showSummary}
                onMouseUp={this.hideSummary}
                onTouchStart={this.showSummary}
                onTouchMove={this.showSummary}
                onDrag={this.showSummary}
              >
                <span className="bmo_chevron left" />
                <span className="bmo_chevron right" />
              </div>
            </div>
          </ReactSlider>
        </div>
      </div>
    );
  }
}

export default HighChartScroller;
