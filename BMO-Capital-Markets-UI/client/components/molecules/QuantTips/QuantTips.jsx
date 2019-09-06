/* @flow weak */

/*
 * Component: QuantTips
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Heading, Grid, Image } from 'unchained-ui-react';
import { imageTitleMap } from 'constants/assets';
import {
  GET_TIPS_DATA
} from 'store/actions';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  quantSelector
} from 'store/selectors';
import './QuantTips.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QuantTips extends Component {
  props: {
    tipsData: {},
    getTipsData: () => void,
    lastUpdatedDate: ''
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }
  componentWillMount() {
    this.props.getTipsData();
  }

  render() {
    const { tipsData, lastUpdatedDate } = this.props;
    return (
      <div className="quant-tips">
        {
          tipsData && tipsData.data && tipsData.data.map((tipsCat, i) => {
            return (
              <div className="tips-section-wrapper">
                <div id={tipsCat.value.toLowerCase().replace(/\s/g, '').replace(/&/g, '-')} />
                <div className="tips-section">
                  <Heading content={tipsCat.value} as={'h1'} />
                  <Grid computer={2} mobile={1}>
                    <Grid.Row>
                      {
                        tipsCat && tipsCat.children && tipsCat.children.map((data) => {
                          const imgURL = imageTitleMap[data.value];
                          return (
                            <Grid.Column key={Math.random()} className="tips-detail-cell" computer={6} mobile={12}>
                              <div className="tips-detail">
                                <div className="section-icon">
                                  {
                                    data.link ?
                                      <Image as={'a'} target={'_blank'} href={data.link} src={imgURL || '/assets/images/sector_Icons/Materials_Selected.png'} />
                                      :
                                      <Image src={imgURL || '/assets/images/sector_Icons/Materials_Selected.png'} />
                                  }
                                </div>
                                <div className="section-description">
                                  {
                                    data.link ?
                                      <Heading as={'a'} target={'_blank'} href={data.link} content={data.value} />
                                      :
                                      <Heading content={data.value} as={'h2'} />
                                  }
                                  <div className="details">
                                    {data.description}
                                  </div>
                                </div>
                              </div>
                            </Grid.Column>
                          );
                        })
                      }
                    </Grid.Row>
                  </Grid>
                </div>
                {
                  (tipsData.data.length - 1) > i ?
                    <span className="h-ln" />
                    : null
                }
              </div>
            );
          })
        }
        <div className={'last-updated-tips'}>Last Updated: {lastUpdatedDate}</div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  tipsData: quantSelector.getTipsData(state),
  lastUpdatedDate: quantSelector.getLastUpdateDate(state),
});
const mapDispatchToProps = (dispatch) => ({
  getTipsData: async () => {
    dispatch(GET_TIPS_DATA());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(QuantTips);
