/* @flow weak */

/*
 * Component: QuantSectorCircle
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button } from 'unchained-ui-react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QuantSectorCircle.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QuantSectorCircle extends Component {
  props: {
    idx: number,
    showQuantScale: () => void,
    quantFieldName: '',
    childSectors: {},
    isSelected: bool,
    strength: number,
    momentum: number,
  };

  static defaultProps = {
  };

  state = {
    isOpen: false,
    isSelected: false,
    childSectors: {}
  };

  componentDidMount() {
    // Component ready
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.isSelected !== nextProps.isSelected) {
      this.setState({ isSelected: nextProps.isSelected });
    }
  }
  componentWillMount() {
    this.setState({ childSectors: this.props.childSectors, isSelected: this.props.isSelected });
  }
  handleClose = () => {
    this.setState({
      isOpen: false
    });
  }
  handleOpen = (idx, quantKey, data) => () => {
    this.setState({
      isOpen: true
    });
    this.props.showQuantScale(idx, quantKey, data);
  }
  render() {
    const { quantFieldName, idx, strength, momentum } = this.props;
    const { isSelected } = this.state;
    const fieldName = (quantFieldName && quantFieldName.split('(')[0]);
    const totalSubSect = (quantFieldName && (quantFieldName.split('(').length > 1) && quantFieldName.split('(')[1].split(')')[0]);
    const imageName = fieldName.replace(/ /g, '');
    console.log(imageName)//eslint-disable-line
    return (
      <div className="quant-sector-circle" id={`sector-circle-${idx}`}>
        <div className="circle-and-count">
          <span className="value">{totalSubSect}</span>
          <div className="quant-circle-holder" onClick={this.handleOpen(`sector-circle-${idx}`, fieldName, this.state.childSectors)} role="button" tabIndex={0} onKeyPress={() => {}}>
            <Button className={isSelected ? `quant-icons quant-${imageName} selected` : `quant-icons quant-${imageName}`} />
          </div>
          <div className="icons">
            <span className={`circle circle_${strength}`} />
            <span className={`arrow-up arrow-up_${momentum}`} />
          </div>
        </div>
        <span className="sector-name">{fieldName}</span>
      </div>
    );
  }
}

export default QuantSectorCircle;
