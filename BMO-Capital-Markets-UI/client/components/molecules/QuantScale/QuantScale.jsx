/* @flow weak */

/*
 * Component: QuantScale
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button } from 'unchained-ui-react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QuantScale.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QuantScale extends Component {
  props: {
    idx: '',
    showAllQuant: () => void,
    strength: number,
    momentum: number,
    data: {}
  };

  static defaultProps = {
  };

  state = {
    momentSliderValue: 0,
    strengthSliderValue: 0
  };

  componentDidMount() {
    //
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.idx !== nextProps.idx) {
      this.setState({ isToHide: false, idx: nextProps.idx });
    }
  }
  componentWillMount() {
    this.setState({ idx: this.props.idx });
  }
  momentSliderChange = (val) => {
    this.setState({ momentSliderValue: val });
  }
  strengthSliderChange = (val) => {
    this.setState({ strengthSliderValue: val });
  }
  showAllQuant = () => {
    this.props.showAllQuant();
    this.setState({ isToHide: true });
  }
  getColorSpan = () => {
    const arr = [];
    /* eslint-disable */
    for (let i=10; i>= 0; i--) {
      arr.push(<span className={`bgColorHolder bgColorHolder_${i}`} />);
    }
    /* eslint-enable */
    return arr;
  }

  render() {
    const { idx, strength, momentum, data } = this.props;
    const { isToHide } = this.state;
    const stengthmarkerStyle = {
      right: `${(((strength - 0) * 9) + 1)}%` // eslint-disable-line
    };
    const momentummarkerStyle = {
      right: `${(((momentum - 0) * 9) - 1)}%` // eslint-disable-line
    };
    return (
      <div className={`quant-scale ${isToHide}`} id={idx}>
        <div className="title">{data.value}</div>
        <div className="linksHolder">
          <a className="show-all-link" target="_blank" href={data.link}> Show Graph </a>
          <Button className="show-all-link" onClick={this.showAllQuant}> Expand Sector </Button>
        </div>
        <div className="strength">
          <span> Strength </span>
          <div className="bgColorHolderContainer">
            {this.getColorSpan()}
            <span style={stengthmarkerStyle} className={`circle circle_${strength}`} />
          </div>
        </div>
        <div className="momentum">
          <span> Momentum </span>
          <div className="bgColorHolderContainer">
            {this.getColorSpan()}
            <span style={momentummarkerStyle} className={`triangle triangle_${momentum}`} />
          </div>
        </div>
      </div>
    );
  }
}

export default QuantScale;
