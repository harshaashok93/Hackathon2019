/* @flow weak */

/*
 * Component: QModelOneZeroOneComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Accordion, Label } from 'unchained-ui-react';
import { RichText } from 'components';
import st from 'constants/strings';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QModelOneZeroOneComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QModelOneZeroOneComponent extends Component {
  props: {
    data: []
  };

  static defaultProps = {
  };

  state = {
    panels: []
    // Initialize state here
  };

  componentWillMount() {
    const dataArray = [];
    this.props.data.map((item, i) => {
      const dataDict = {};
      dataDict.key = `${i}-panels`;
      dataDict.title = <Label className="accord-title" content={item.QModelAccordian.headingText} title={st.showMore} />;
      dataDict.content = <div className="accord-content"><RichText richText={item.QModelAccordian.content} /></div>;
      dataArray.push(dataDict);
    });
    this.setState({ panels: dataArray });
  }

  render() {
    return (
      <div className="q-model-one-zero-one-component">
        <div className="one_zero_one_accordions">
          <Accordion panels={this.state.panels} fluid />
        </div>
      </div>
    );
  }
}

export default QModelOneZeroOneComponent;
