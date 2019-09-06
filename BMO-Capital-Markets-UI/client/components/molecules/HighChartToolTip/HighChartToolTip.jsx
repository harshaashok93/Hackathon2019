/* @flow weak */

/*
 * Component: HighChartToolTip
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import moment from 'moment';
import { CustomNavLink } from 'components';
import { Image } from 'unchained-ui-react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './HighChartToolTip.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class HighChartToolTip extends Component {
  props: {
    publicationsOnDates: {},
    container: ''
  };

  static defaultProps = {
  };

  state = {
    show: false,
    markerDate: '',
    markerUrlDark: '/assets/images/publication_marker.png',
    markerUrl: '/assets/images/publication_marker_dark.png',
    commentIconDark: '/assets/images/Sector_Comment_Pin.png',
    commentIcon: '/assets/images/Sector_Comment_Pin_Dark.png'
  };

  componentWillMount() {
    const { container } = this.props;
    const containerNode = document.getElementById(container);
    if (container && containerNode) {
      containerNode.addEventListener('scroll', this.handleScroll);
    } else {
      window.addEventListener('scroll', this.handleScroll);
    }
    document.body.addEventListener('click', this.handleToolTipClick);
    document.body.addEventListener('touchstart', this.handleToolTipClick);
    this.setState({ publicationsOnDates: this.props.publicationsOnDates });
  }

  componentWillUnmunt() {
    if (container) {
      document.getElementById(container).removeEventListener('scroll', this.handleScroll);
    } else {
      window.removeEventListener('scroll', this.handleScroll);
    }
    document.body.removeEventListener('touchstart', this.handleToolTipClick);
    document.body.removeEventListener('click', this.handleToolTipClick);
  }

  componentDidMount() {
  }

  handleScroll = () => {
    if (this.state.show) {
      this.setState({ show: false });
    }
  }

  handleToolTipClick = (e) => {
    if (e.target.localName === 'image' && e.target.className.baseVal.indexOf('highcharts-point') > -1) {
      const rect = e.target.getBoundingClientRect();
      const container = document.getElementById('coverage-overlay-modal');
      const scrollLeft = 0;
      const scrollTop = container ? container.scrollTop : 44;
      const pos = { top: (rect.top - 45) + scrollTop, left: rect.left + scrollLeft };
      const markerDate = e.target.attributes.fill.nodeValue;// eslint-disable-line
      let adjBuffX = 0;
      const tipTrianglePos = { top: rect.top - 10, left: rect.left + 10 };
      this.setState({ markerDate, show: true }, () => {
        const tooltipBoundBox = document.getElementById('high-chart-tool-tip').getBoundingClientRect();
        if ((pos.left + 155) >= window.innerWidth) {
          adjBuffX = -1 * ((pos.left + 155) - window.innerWidth);
        }
        if ((pos.left - 130) < 5) {
          adjBuffX = 5 - (pos.left - 130);
        }
        tipTrianglePos.top = pos.top - 7;
        this.setState({
          tipTrianglePos,
          tooltipPosX: (pos.left - 130) + adjBuffX,
          tooltipPosY: (pos.top - tooltipBoundBox.height)
        });
      });
    } else {
      const theToolTip = document.getElementById('high-chart-tool-tip');
      if (theToolTip) {
        const tooltipBoundBox = theToolTip.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.type === 'touchstart') {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }
        if (!(clientX >= tooltipBoundBox.left
          && clientX <= (tooltipBoundBox.left + tooltipBoundBox.width)
          && clientY >= tooltipBoundBox.top
          && clientY <= (tooltipBoundBox.top + tooltipBoundBox.height)
        )) {
          this.setState({ show: false });
        }
      }
    }
  }
  getMarker = (commentIconDark, commentIcon, data) => {
    return (
      <Image
        alt="A publication marker"
        className="mini-marker"
        src={(data.companyComment === 'Company Comment' ? commentIconDark : commentIcon)}
      />
    );
  }
  getCustomNavLink = (isHistorical, radarLink, productId, title) => {
    return (
      <CustomNavLink
        to={isHistorical ? radarLink : `/research/${productId}/`}
        isHistoricalPublication={isHistorical}
        radarLink={isHistorical ? radarLink : ''}
      >
        {title}
      </CustomNavLink>
    );
  }
  render() {
    const { show, tipTrianglePos, publicationsOnDates, markerDate, commentIconDark, commentIcon, tooltipPosX, tooltipPosY } = this.state;
    const date = moment(parseInt(markerDate, 10)).format('MM/DD/YYYY');
    const publicationDataOnDate = publicationsOnDates[markerDate];
    const tipPos = { left: tooltipPosX, top: tooltipPosY };
    let isHistorical = '';
    let radarLink = '';
    let productId = '';
    let title = '';
    if (publicationDataOnDate) {
      isHistorical = publicationDataOnDate.isHistorical;
      radarLink = publicationDataOnDate.radarLink;
      productId = publicationDataOnDate.productId;
      title = publicationDataOnDate.title;
    }
    return (
      <div style={tipPos} className="high-chart-tool-tip" id="high-chart-tool-tip">
        {
          markerDate && show ?
            <div>
              <div style={tipTrianglePos} className="high-chart-tip-triangle" />
              <div className="marker-pop-up-content">
                <div className="tip-header">
                  {this.getMarker(commentIconDark, commentIcon, publicationDataOnDate)}
                  <div className="company">{publicationDataOnDate.companyComment}</div>
                </div>
                <div className="tip-details">
                  <div className="date">{date}</div>
                  <div className="details">
                    {this.getCustomNavLink(isHistorical, radarLink, productId, title)}
                  </div>
                </div>
              </div>
            </div>
            : null
        }
      </div>
    );
  }
}

export default HighChartToolTip;
