/* @flow weak */

/*
 * Component: QuantTreeCoulmnCard
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QuantTreeCoulmnCard.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QuantTreeCoulmnCard extends Component {
  props: {
    isLeaf: bool,
    isSelected: bool,
    keyText: '',
    setSelectedColumn: () => void,
    keyVal: '',
    depth: 0,
    idx: number,
    data: {}
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }
  setSelectedColumn = (val, depth, idx) => () => {
    if (this.props.setSelectedColumn) {
      this.props.setSelectedColumn(val, depth, idx);
    }
  }
  render() {
    const { isSelected, isLeaf, keyText, keyVal, depth, idx, data } = this.props;
    const fieldData = (keyText && keyText.split('('));
    const fieldName = fieldData[0];
    const fieldValCount = fieldData.length > 1 ? `(${fieldData[1]}` : '';
    if (isLeaf) {
      return (
        <div className={isSelected ? 'quant-tree-coulmn-card selected' : 'quant-tree-coulmn-card'}>
          {
            isLeaf ?
              <a href={data.link} target="_blank" className="key-text-leaf">{fieldName} <span className="count">{fieldValCount}</span></a>
              : <span className="key-text-leaf">{fieldName}</span>
          }
          <div className="circle-and-riangle">
            <span className={`circle circle_${data.strength}`} />
            <span className={`triangle arrow-up_${data.momentum}`} />
          </div>
        </div>
      );
    }
    return (
      <div
        onKeyPress={() => {}}
        tabIndex={0}
        role="button"
        onClick={this.setSelectedColumn(keyVal, depth, idx)}
        className={isSelected ? 'quant-tree-coulmn-card selected' : 'quant-tree-coulmn-card'}
      >
        <span className="key-text">{fieldName}</span>
        <span className={isSelected ? 'circle-link-white the-link-circle' : 'circle-link the-link-circle'} title={'show more'} />
      </div>
    );
  }
}

export default QuantTreeCoulmnCard;
