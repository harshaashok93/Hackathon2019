/* @flow weak */

/*
 * Component: BmoHighChart
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import ReactHighChart from 'react-highcharts';
import { HighChartScroller, HighChartToolTip } from 'components';
import ReactDOMServer from 'react-dom/server';
import { Loader } from 'unchained-ui-react';
import moment from 'moment';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './BmoHighChart.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class BmoHighChart extends Component {
  props: {
    graphHeight: number,
    researchLayoutMetaDataLoading: bool
  };

  static defaultProps = {
  };
  graphConfig = {
    title: {
      useHTML: true,
      text: ''
    },
    chart: {
      backgroundColor: 'rgba(255, 255, 255, 0.0)',
      height: (this.props.graphHeight || '350px'),
      marginBottom: 30,
      marginTop: 50,
      style: {
        top: 100
      },
      marginLeft: 0,
      marginRight: 0,
      spacingLeft: 0,
      /*eslint-disable*/
    },
    yAxis: {
      offset: -80,
      width: 1,
      title: {
        enabled: true,
        text: 'Price',
      },
      labels: {
        formatter: function() {
          let newValue = this.value;
          const suffixes = ["", "K", "M", "B","T"];
          let suffixNum = 0;
          while (newValue >= 1000) {
            newValue /= 1000;
            suffixNum++;
          }
          newValue += suffixes[suffixNum];
          return newValue;
        }
      }
    },
    xAxis: {
      tickLength: 250,
      tickInterval: 86400000,
      gridLineWidth: 0,
      tickPosition: 'inside',
      lineColor: 'transparent',
      startOnTick: true,
      endOnTick: true,
      labels: {
        enabled: true,
        style:{
          height: '100px',
        },
        formatter: function() {
          if(this.isFirst || this.isLast) {
            return null;
          }
          const date = new Date(this.value);
          const month = date.toLocaleString("en-us", { month: "long" });
          return `${month.replace(/[^ -~]/g, '').substring(0, 3)} ${date.getFullYear().toString()}`;
        },
      },
      tickmarkPlacement: 'on'
    },
    navigator: {
      height: 10
    },
    tooltip: {
      useHTML: true,
      headerFormat: '',
      padding: 8,
      snap: 0,
      hideDelay: 1000,
      borderWidth: 0,
      borderRadius: 10,
      backgroundColor: '#fff',
      boxShadow: '5px 1000px #aaa',
      enabled: false,
      formatter: function() {return this.point.companyInfo;},
      /*positioner: function(labelWidth, labelHeight, point) {
        var tooltipX = Math.max(point.plotX - (labelWidth / 2), 3) ;
        if (tooltipX + labelWidth > (this.chart.plotWidth + this.chart.plotLeft)) {
          tooltipX = point.plotX - labelWidth - 15;
        }
        var tooltipY = Math.max(point.plotY - labelHeight - 5, 3);
        return {
            x: tooltipX,
            y: tooltipY
        };
      },
      /* eslint-disable */
      style: {
        whiteSpace: 'pre-line',
        border: 'none',
        zIndex: 999,
        boxShadow: '5px 5px #aaa',
        overflowWrap: 'break-word',
        fontSize: '16px',
        pointerEvents: 'auto',
      }
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        enableMouseTracking: false
      },
      line: {
        animation: false,
        marker: {
          enabled: false
        }
      }
    },
    series: [{
      lineWdth: 0.5,
      showInLegend: false,
      name: 'BMO-data',
      data: [],
      tooltip: {
        valueDecimals: 2
      },
      point: {
        events: {
          click: function () {
            this.series.tooltipOptions.enabled = true;
          }
        }
      },
      cursor: 'pointer',
      /*eslint-disable*/
    }]
  }
  state = {
  };
  componentWillMount() {
    this.populateData(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.populateData(nextProps);
  }
  populateData = (data) => {
    let idx;
    let mod;
    let dataPoints = [];
    let tickPoints = [];
    const { graphData, minVal, maxVal, oneUnit, markerUrl, markerUrlDark, commentIcon, commentIconDark, publicationData } = data;
    if (!graphData) {
      return 0;
    }
    let publicationCounter = 0;
    let publicationsOnDates = {};
    const publicationDataFormated = publicationData.map(comment => {
      let publicationDate = new Date(Date.parse(comment.date));
      publicationDate = publicationDate.setHours(0, 0, 0, 0).valueOf();
      let publicationType = '';
      if (comment.publicationType === 'CC' || comment.publicationType === 'Comment') {
        publicationType = 'Company Comment';
      } else if (comment.publicationType === 'SC') {
        publicationType = 'Sector Comment';
      } else if (comment.publicationType === 'Flash') {
        publicationType = 'Company Flash';
      } else {
        publicationType = 'Company Comment'; // For Now its assumed to be default
      }
      publicationsOnDates[publicationDate] = {
        companyComment: publicationType,
        title: comment.title || 'N/A',
        date: publicationDate,
        productId: comment.productId,
        isHistorical: comment.historical_publication || false,
        radarLink: comment.radarLink || ''
      }
    });

    const isPublicationComment = (publicationDataFormated.length >= 1);
    const minDate = new Date(minVal);
    const maxDate = new Date(maxVal);
    tickPoints.push(Date.parse(minDate));
    for(mod=0,idx = minVal ; idx <= maxVal; idx += oneUnit) {
      const intDate = new Date(idx);
      if (intDate.getDate() === 1) {
        mod += 1;
      }
      if ((maxVal - minVal) / oneUnit > 365) {
        if (intDate.getDate() === 1 && mod % 9 === 0 && (maxVal - idx) > (120 * oneUnit)) {
          tickPoints.push(Date.parse(intDate));
        }
      } else if ((maxVal - minVal) / oneUnit > 200) {
        if (intDate.getDate() === 1 && mod % 3 === 0 && (maxVal - idx) > (40 * oneUnit)) {
          tickPoints.push(Date.parse(intDate));
        }
      } else if ((maxVal - minVal) / oneUnit > 100) {
        if (intDate.getDate() === 1 && mod % 2 === 0 && (maxVal - idx) > (20 * oneUnit)) {
          tickPoints.push(Date.parse(intDate));
        }
      } else if ((maxVal - minVal) / oneUnit > 50) {
        if (intDate.getDate() === 1 && (maxVal - idx) > (5 * oneUnit)) {
          tickPoints.push(Date.parse(intDate));
        }
      } else if ((maxVal - minVal) / oneUnit > 20) {
        if (window.innerWidth > 500 && intDate.getDay() === 1 && (maxVal - idx) > (5 * oneUnit)) {
          tickPoints.push(Date.parse(intDate));
        } else if (window.innerWidth <= 500 && (intDate.getDate() === 1 || intDate.getDate() === 15) && (maxVal - idx) > (5 * oneUnit)) {
          tickPoints.push(Date.parse(intDate));
        }
      } else {
        if ((maxVal - idx) > (5 * oneUnit)) {
          tickPoints.push(Date.parse(intDate));
        }
      }
    }
    tickPoints.push(Date.parse(maxDate));
    for(idx = 0 ; idx < graphData.length; idx++) {
      const date = moment(graphData[idx].date).format('MM/DD/YYYY');
      const month = date.toLocaleString("en-us", { month: "long" }).substring(0, 3);
      const graphPointDate = new Date(graphData[idx].date);
      const theDate = graphPointDate.setHours(0, 0, 0, 0).valueOf();
      const publicationDataOnDate = publicationsOnDates[theDate];
      if (publicationDataOnDate) {
        dataPoints.push({
          y: graphData[idx].value,
          x: graphData[idx].date,
          companyInfo: ReactDOMServer.renderToStaticMarkup(
            <div className="marker-pop-up-content">
              <div className="tip-header">
                <img className="mini-marker" src={(publicationDataOnDate.companyComment === 'Company Comment' ? commentIconDark : commentIcon )} />
                <div className="company">{publicationDataOnDate.companyComment}</div>
              </div>
              <div className="tip-details">
                <div className="date">{date}</div>
                <div className="details"
                  htmlFor="its-from-marker"
                  data-historical={publicationDataOnDate.isHistorical && publicationDataOnDate.isHistorical.toString()}
                  data-radarlink={publicationDataOnDate.radarLink}
                  data-productid={publicationDataOnDate.productId}
                  data-title={publicationDataOnDate.title}
                >
                  {publicationDataOnDate.title}
                </div>
              </div>
            </div>
          ),
          volume: graphData[idx].volume,
          marker: {
            symbol: (publicationDataOnDate.companyComment === 'Company Comment' ? `url(${markerUrlDark})` : `url(${markerUrl})`),
            enabled: true,
            fillColor: `${theDate}`
          }
        });
      } else {
        dataPoints.push({
          y: graphData[idx].value,
          x: graphData[idx].date,
          volume: graphData[idx].volume,
          companyInfo: false,
          marker: {
            color: 'transparent',
            radius: 0,
            enabled: false
          }
        });
      }
    }
    let graphConfig = this.graphConfig;
    graphConfig.series[0].data = dataPoints;
    const fromDate = new Date(graphData[0].date);
    const toDate = new Date(graphData[graphData.length - 1].date);
    const fromMonth = fromDate.toLocaleString("en-us", { month: "short" });
    const toMonth = toDate.toLocaleString("en-us", { month: "short" });
    const graphSummary = Math.floor(((graphData[graphData.length - 1].value - graphData[0].value)/graphData[0].value)*10000)/100;
    let titleText = graphSummary < 0 ? `<div class='title'>
        <span class='title-text'>
          ${fromMonth} ${fromDate.getDate()} ${fromDate.getYear() + 1900} - ${toMonth} ${toDate.getDate()} ${toDate.getYear() + 1900}
        </span>
        <span class='title-summary'>
          ${graphSummary}%
        </span>
      </div>` : `<div class='title'>
        <span class='title-text'>
          ${fromMonth} ${fromDate.getDate()} ${fromDate.getFullYear()} - ${toMonth} ${toDate.getDate()} ${toDate.getFullYear()}
        </span>
        <span class='positive title-summary'>
          ${graphSummary}%
        </span>
      </div>`;
    graphConfig.title.text = titleText;
    graphConfig.xAxis.tickPositions = tickPoints;
    this.setState({ graphConfig, publicationData: data.publicationData, minVal, maxVal, oneUnit, publicationsOnDates });
  }
  render() {
    const { publicationsOnDates, graphConfig, oneUnit, minVal, maxVal, markerDate } = this.state;
    const { graphHeight, researchLayoutMetaDataLoading } = this.props;
    return (
      <div className="bmo-high-chart-holder">
        <HighChartToolTip
            publicationsOnDates={publicationsOnDates}
            markerDate={markerDate}
            container={this.props.container}
          />
        <div className="bmo-high-chart">
          <HighChartScroller
            data={graphConfig.series[0].data}
            className={this.props.highChartSlider}
            oneUnit={oneUnit}
            minVal={minVal}
            maxVal={maxVal}
            coverHeight={graphHeight}
          />
          {
            researchLayoutMetaDataLoading ? <div className="chartLoader"><Loader active={true} content={'Loading ...'} /></div> : null
          }
          <ReactHighChart className="high-chart" config={graphConfig} />
        </div>
      </div>
    );
  }
}

export default BmoHighChart;
