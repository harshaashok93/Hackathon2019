import React, { Component } from 'react';

import { DEFAULT_PROFILE } from 'constants/assets';

import { Grid, Image, Checkbox, Button, List } from 'unchained-ui-react';

import { pushToDataLayer } from 'analytics';

class Analysts extends Component {
  props: {
    analysts: [],
    callback: () => void
  }

  state = {
    analysts: [],
    coverage: [null],
    currentRow: 0,
    currentAnalyst: null,
    viewtype: '',
  };

  partitionToGroups = (items, n) => {
    const arrays = [];
    while (items.length > 0) {
      arrays.push(items.splice(0, n));
    }
    return arrays;
  }

  analystSelections = [];

  handleAnalystSelection = (evt, { checked, value }) => {
    this.scrollOngetSector = false;
    const { callback } = this.props;
    const index = this.analystSelections.indexOf(value);

    if (!checked) {
      if (index === -1) return;
      this.analystSelections.splice(index, 1);
    } else if (index === -1) {
      this.analystSelections.push(value);
    }

    callback(Object.assign([], this.analystSelections));
  }

  componentDidMount() {
    pushToDataLayer('onboarding', 'analystsOverlay');
  }
  scrollOngetSector = false;
  componentDidUpdate() {
    const { viewtype } = this.state;
    const ele = document.getElementById(viewtype);
    if (ele && this.scrollOngetSector) {
      ele.scrollIntoView();
    }
  }

  getCoveragList = (type, id, i) => () => {
    this.scrollOngetSector = true;
    const { analysts } = this.props;
    let coverage = [];
    analysts.map((data) => {
      if (data.id === id) {
        coverage = Object.assign([], data.coverage);
      }
      return null;
    });
    this.setState({ coverage, currentRow: i, currentAnalyst: id, viewtype: type });
  }

  renderCoverageList = (type, items, colNum, columnWidth) => {
    let arr = [];

    let rowcount = '';
    switch (type) {
      case 'desktop':
        if (items && items.length) {
          rowcount = parseInt((items.length / 4), 10) + 1;
        }
        break;
      case 'ipad':
        if (items && items.length) {
          rowcount = parseInt((items.length / 2), 10) + 1;
        }
        break;
      default:
        rowcount = '';
    }

    if (rowcount !== '') {
      arr = this.partitionToGroups(Object.assign([], items), rowcount);
    } else {
      arr = [Object.assign([], items)];
    }
    return (
      <Grid columns={colNum} id={'covergeListId'}>
        {
          arr.map((data) => {
            return (
              <Grid.Column width={columnWidth} key={Math.random()}>
                <List>
                  {
                    data.map((coverage) => {
                      return <List.Item><div className={'small circle'} />{coverage}</List.Item>;
                    })
                  }
                </List>
              </Grid.Column>
            );
          })
        }
      </Grid>
    );
  }

  renderAnalystContent = (type, arr, gridColumn, analystCol, coverageListColumn, columnWidth) => {
    const { currentRow, analysts } = this.state;

    const currentAnalyst = (this.state.currentAnalyst === null && analysts.length > 0) ? analysts[0].id : this.state.currentAnalyst;
    const coverage = (this.state.coverage[0] === null && analysts.length > 0) ? analysts[0].coverage : this.state.coverage;

    return (
      arr.map((data, i) => {
        return (
          <Grid columns={gridColumn}>
            {
              data.map((analyst) => {
                return (
                  <Grid.Column className={`analystGrid ${currentAnalyst === analyst.id ? 'activeAnalyst' : ''}`} id={`${type}${analyst.id}`} key={Math.random()}>
                    <Grid columns={2}>
                      <Grid.Column className={'checkbox-col'} width={type === 'mobile' ? 2 : 1}>
                        <Checkbox value={analyst.id} className={'analyst-checkbox'} checked={this.analystSelections.indexOf(analyst.id) > -1} aria-label={analyst.name} onChange={this.handleAnalystSelection} />
                      </Grid.Column>
                      <Grid.Column width={analystCol} className={`analyst-col ${currentAnalyst === analyst.id ? 'activeAnalyst' : ''}`}>
                        <div className={'analyst-details'} onKeyPress={() => {}} role="button" tabIndex={0} onClick={this.getCoveragList(`${type}${analyst.id}`, analyst.id, i)}>
                          <Image src={analyst.image || DEFAULT_PROFILE.img} shape={'circular'} />
                          <div className={'name'}>{analyst.position ? `${analyst.name}, ${analyst.position}` : analyst.name}</div>
                          <div className={'subsector'}>{analyst.role}</div>
                        </div>
                        <Button className={`linkBtn bmo_chevron bottom ${currentAnalyst === analyst.id ? 'activeAnalyst' : ''}`} onClick={this.getCoveragList(`${type}${analyst.id}`, analyst.id, i)} />
                      </Grid.Column>
                    </Grid>
                  </Grid.Column>
                );
              })
            }
            {currentRow === i &&
              <div className={'coverage-list-div'}>
                <div className={'coverlagelist-heading'}>{coverage && coverage.length ? 'Coverage List' : 'No Company Coverage'}</div>
                {this.renderCoverageList(type, coverage, coverageListColumn, columnWidth)}
              </div>
            }
          </Grid>
        );
      })
    );
  }

  componentWillReceiveProps(nextProps) {
    const { analysts } = nextProps;
    this.setState({ analysts });
  }

  componentWillMount() {
    const { analysts } = this.props;
    this.setState({ analysts });
  }

  render() {
    const { analysts } = this.props;
    const deskTopArr = this.partitionToGroups(Object.assign([], analysts), 4);
    const ipdadArr = this.partitionToGroups(Object.assign([], analysts), 2);
    const mobileArr = this.partitionToGroups(Object.assign([], analysts), 1);
    return (
      <div className="analysts">
        <div className={'desktopView'}>{this.renderAnalystContent('desktop', deskTopArr, 4, 7, 4, 3)}</div>
        <div className={'ipadView'}>{this.renderAnalystContent('ipad', ipdadArr, 2, 7, 2, 6)}</div>
        <div className={'mobileView'}>{this.renderAnalystContent('mobile', mobileArr, 1, 8, 1, 12)}</div>
      </div>
    );
  }
}

export default Analysts;
