import React, { Component } from 'react';
import RelatedResearch from './RelatedResearch';

class IndustryResearch extends Component {
  props: {
    data: {},
  }
  render() {
    const { data } = this.props;
    return (
      <RelatedResearch data={data} title={'Industry Research'} />
    );
  }
}

export default IndustryResearch;
