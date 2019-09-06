/* @flow weak */

/*
 * Component: EquityScreening
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Heading } from 'unchained-ui-react';
import {
  QuantSectorCircle,
  ControllBox,
  QuantSectorDetailsModal,
  QuantScale
} from 'components';
import {
  quantSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './EquityScreening.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class EquityScreening extends Component {
  props: {
    quantData: {},
    title: ''
  };

  static defaultProps = {
  };

  state = {
    selectedQuantCircleIdx: 'equity-screening',
    showQuantScale: false,
    showAllQuant: false,
    quantModalData: {}
  };

  componentDidMount() {
    // Component ready
  }
  showQuantScale = (idx, quantKey, quantModalData) => {
    this.setState({ selectedQuantCircleIdx: idx, showQuantScale: true, showAllQuant: false, quantKey, quantModalData });
  }
  closeControllBox = () => {
    this.setState({ showQuantScale: false });
  }
  closeAllQuantBox = () => {
    this.setState({ showAllQuant: false });
  }
  showAllQuant = () => {
    this.setState({ showAllQuant: true });
  }
  render() {
    const { quantData, title } = this.props;
    const { selectedQuantCircleIdx, showQuantScale, quantKey, showAllQuant, quantModalData } = this.state;
    let strength = 0;
    let momentum = 0;
    let quantScaleData = null;
    if (quantData) {
      const index = selectedQuantCircleIdx.split('sector-circle-quant-circle-')[1];
      if (index) {
        quantScaleData = quantData[index];
        if (quantScaleData) {
          strength = quantScaleData.strength;
          momentum = quantScaleData.momentum;
        }
      }
    }
    return (
      <div className="wrapper">
        {
          (quantData && quantData.length) ?
            <div>
              <span className="v-ln" />
              <Heading className="page-title" content={title} />
            </div>
            : null
        }
        <div className="equity-screening">
          {
            (quantData && quantData.length) ?
              <div className="sector-section" id="equity-screening">
                {
                  quantData.map((quantField, i) => {
                    return (<QuantSectorCircle
                      childSectors={quantField.children}
                      quantFieldName={quantField.value}
                      isSelected={(selectedQuantCircleIdx === `sector-circle-quant-circle-${i}`)}
                      idx={`quant-circle-${i}`}
                      quantKeyName={quantField.key_name}
                      showQuantScale={this.showQuantScale}
                      strength={quantField.strength}
                      momentum={quantField.momentum}
                    />);
                  })
                }
              </div>
              : null
          }
          <div className="not-on-mobile">
            {
              showQuantScale ?
                <ControllBox calledFor="scale" outEvent="click" topOffsetBuff={220} leftOffSetBuff={-60} direction={'top'} popUpId={'QuantScale'} attachPointIdx={selectedQuantCircleIdx} closeControllBox={this.closeControllBox} stayInside={'equity-screening'} offsetX={'-30px'} widthBuffer={-60}>
                  <QuantScale data={quantScaleData} strength={strength} momentum={momentum} showAllQuant={this.showAllQuant} idx={`${selectedQuantCircleIdx}-scale`} />
                </ControllBox>
                : null
            }
          </div>
          <div className="only-mobile">
            {
              showQuantScale ?
                <ControllBox shadowNeed={'shadow-need'} outEvent="click" fullCover={true} topOffsetBuff={120} leftOffSetBuff={-10} direction={'bottom'} popUpId={'QuantScale'} attachPointIdx={selectedQuantCircleIdx} closeControllBox={this.closeControllBox} stayInside={'equity-screening'}>
                  <QuantScale data={quantScaleData} strength={strength} momentum={momentum} showAllQuant={this.showAllQuant} idx={`${selectedQuantCircleIdx}-scale-mobile`} />
                </ControllBox>
                : null
            }
          </div>
          {
            showAllQuant ?
              <ControllBox
                popUpId={'QuantDetailBox'}
                direction={'bottom'}
                fullCover={true}
                outEvent="mousedown"
                leftOffSetBuff={25}
                topOffsetBuff={40}
                attachPointIdx={selectedQuantCircleIdx}
                noHideBoxesIdx={[`${selectedQuantCircleIdx}-scale`]}
                closeControllBox={this.closeAllQuantBox}
                stayInside={'equity-screening'}
                offsetX={'-30px'}
                triangleClass={'QuantDetailBox-triangle'}
              >
                <QuantSectorDetailsModal
                  quantKey={quantKey}
                  quantModalData={quantModalData}
                />
              </ControllBox>
              : null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  quantData: quantSelector.getQuantData(state),
});

export default connect(mapStateToProps)(EquityScreening);
