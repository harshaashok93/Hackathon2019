/* @flow weak */

/*
 * Component: QuantSectorDetailsModal
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid } from 'unchained-ui-react';
import { QuantTreeCoulmnCard } from 'components';
import { pushToDataLayer } from 'analytics';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QuantSectorDetailsModal.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QuantSectorDetailsModal extends Component {
  props: {
    quantModalData: [],
    quantKey: ''
  };

  static defaultProps = {
  };

  state = {
    quantModalData: {},
    columns: [],
    selectionStack: [this.props.quantKey],
    selectionIndexOnStack: 0,
    selectionKey: '',
    selectionVal: '',
    selectionDepth: '',
    selectionTree: {}
  };
  populateData=(data, depth, selVal) => {
    let columnBData = null;
    let columnCData = null;
    let { selectionTree } = this.state;
    const selectionStack = this.state.selectionStack;
    const columnA = data.map(x => {
      if ((depth === 0 && x.value === selVal) || (selectionTree[0] === x.value && depth !== 0)) {
        selectionTree = {};
        selectionTree[0] = x.value;
        columnBData = x.children;
        selectionStack[1] = x.value;
        return { quantKey: x.value, isSelected: true, isLeaf: false, data: x };
      } else if (depth === -1 && x.children && x.children.length > 0 && !columnBData) {
        columnBData = x.children;
        selectionTree = {};
        selectionTree[0] = x.value;
        selectionStack[1] = x.value;
        return { quantKey: x.value, isSelected: true, isLeaf: false, data: x };
      }
      if (x.children && x.children.length > 0) {
        return { quantKey: x.value, isSelected: false, isLeaf: false, data: x };
      }
      return { quantKey: x.value, isSelected: false, isLeaf: true, data: x };
    });
    const columnB = columnBData && columnBData.map(x => {
      if ((depth === 1 && x.value === selVal) || (selectionTree[1] === x.value && depth !== 0)) {
        selectionTree[1] = x.value;
        columnCData = x.children;
        selectionStack[2] = x.value;
        return { quantKey: x.value, isSelected: true, isLeaf: false, data: x };
      } else if (depth < 1 && x.children && x.children.length > 0 && !columnCData) {
        columnCData = x.children;
        selectionStack[2] = x.value;
        return { quantKey: x.value, isSelected: false, isLeaf: false, data: x };
      }
      if (x.children && x.children.length > 0) {
        return { quantKey: x.value, isSelected: false, isLeaf: false, data: x };
      }
      return { quantKey: x.value, isSelected: false, isLeaf: true, data: x };
    });
    let columnC = [];
    if (depth === 1 && columnCData) {
      columnC = columnCData.map(x => {
        return { quantKey: x.value, isSelected: false, isLeaf: true, data: x };
      });
    }
    const columns = [columnA, columnB, columnC];
    this.setState({ columns, selectionTree });
  }
  componentDidMount() {
    // Component ready
  }
  componentWillMount() {
    this.setState({ quantModalData: this.props.quantModalData });
    this.populateData(this.props.quantModalData, 0, '');
  }
  setSelectedColumn = (val, depth, idx) => {
    if (depth === 0) {
      this.setState({ firstLevelIndustry: val, col2Pos: { paddingTop: `${(idx * 87)}` } });
    }
    if (depth === 1) {
      this.setState({ col3Pos: { paddingTop: `${(parseInt(this.state.col2Pos.paddingTop, 10) + (idx * 87))}` } });
    }
    this.populateData(this.state.quantModalData, depth, val);
    const { selectionIndexOnStack, selectionStack } = this.state;
    if (selectionStack[selectionIndexOnStack + 1]) {
      selectionStack[selectionIndexOnStack + 1] = val;
    } else {
      selectionStack.push(val);
    }
    pushToDataLayer('quant', 'tipsEquityScreening', { label: val, action: this.state.firstLevelIndustry || val, data: {} });
    this.setState({ selectionIndexOnStack: (selectionIndexOnStack + 1), selectionStack });
  }
  backSelectedColumn = () => {
    const { selectionIndexOnStack } = this.state;
    if (selectionIndexOnStack > 0) {
      this.setState({ selectionIndexOnStack: (selectionIndexOnStack - 1) });
    }
  }
  render() {
    const { columns, selectionStack, selectionIndexOnStack, col2Pos, col3Pos } = this.state;
    return (
      <div className="quant-sector-details-modal">
        <div className="only-desktop">
          <Grid>
            <Grid.Row>
              {
                columns[0] && columns[0].length ?
                  <Grid.Column computer={4} tablet={12}>
                    {
                      columns[0].map((data, i) => {
                        return (<QuantTreeCoulmnCard
                          depth={0}
                          setSelectedColumn={this.setSelectedColumn}
                          key={Math.random()}
                          idx={i}
                          keyVal={data.quantKey}
                          keyText={data.quantKey}
                          isSelected={data.isSelected}
                          isLeaf={data.isLeaf}
                          data={data.data}
                        />);
                      })
                    }
                  </Grid.Column>
                  : null
              }
              {
                columns[1] && columns[1].length ?
                  <Grid.Column computer={4} tablet={12} style={col2Pos}>
                    <div className="back-flag-and-sec-title">
                      <span className="bmo_chevron left" />
                      <span className="back-flag"> Back </span>
                      <span className="sec-title"> Capital Food </span>
                    </div>
                    {
                      columns[1] && columns[1].map((data, i) => {
                        return (<QuantTreeCoulmnCard
                          idx={i}
                          setSelectedColumn={this.setSelectedColumn}
                          key={Math.random()}
                          depth={1}
                          keyText={data.quantKey}
                          keyVal={data.quantKey}
                          isSelected={data.isSelected}
                          isLeaf={data.isLeaf}
                          data={data.data}
                        />);
                      })
                    }
                  </Grid.Column>
                  : null
              }
              {
                columns[2] && columns[2].length ?
                  <Grid.Column computer={4} tablet={12} style={col3Pos}>
                    {
                      columns[2] && columns[2].map((data) => {
                        return (<QuantTreeCoulmnCard
                          setSelectedColumn={this.setSelectedColumn}
                          key={Math.random()}
                          depth={2}
                          keyText={data.quantKey}
                          keyVal={data.quantKey}
                          isSelected={data.isSelected}
                          isLeaf={data.isLeaf}
                          data={data.data}
                        />);
                      })
                    }
                  </Grid.Column>
                  : null
              }
            </Grid.Row>
          </Grid>
        </div>
        <div className="not-on-desktop">
          <Grid>
            <Grid.Row>
              <Grid.Column computer={4} tablet={12}>
                <div className="back-flag-and-sec-title">
                  <div className="back-button-holder">
                    {
                      selectionIndexOnStack > 0 ?
                        <div
                          className="back-button"
                          onClick={this.backSelectedColumn}
                          onKeyPress={() => {}}
                          tabIndex={0}
                          role="button"
                        >
                          <span className="bmo_chevron left" />
                          <span className="back-flag"> Back </span>
                        </div>
                        : null
                    }
                  </div>
                  <span className="sec-title"> {selectionStack[selectionIndexOnStack]} </span>
                </div>
                {
                  columns[selectionIndexOnStack] && columns[selectionIndexOnStack].map((data) => {
                    return (<QuantTreeCoulmnCard
                      depth={selectionIndexOnStack}
                      setSelectedColumn={this.setSelectedColumn}
                      keyText={data.quantKey}
                      keyVal={data.quantKey}
                      isSelected={data.isSelected}
                      isLeaf={data.isLeaf}
                      data={data.data}
                    />);
                  })
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default QuantSectorDetailsModal;
