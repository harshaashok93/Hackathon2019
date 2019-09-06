import React, { Component } from 'react';
import { Heading, Button } from 'unchained-ui-react';
import SearchFormatter from './SearchFormatter';

class SimpleListView extends Component {
  props: {
    data: {},
    row: boolean
  }

  state = {
    showAll: false
  }

  MAX_LENGTH = 6;

  showAllItems = () => {
    this.setState({ showAll: true });
  }

  render() {
    const { data, row } = this.props;
    const { showAll } = this.state;
    if (!data) return null;
    let dataArray = data.data || [];
    let activeShowAllBtn = false;

    if (dataArray.length > this.MAX_LENGTH && row === true && showAll === false) {
      dataArray = dataArray.slice(0, (this.MAX_LENGTH - 1));
      activeShowAllBtn = true;
    }
    if (dataArray.length === 0) return null;
    return (
      <div className={`simple-list-view ${row ? 'row' : 'column'}`}>
        <Heading className="title">{SearchFormatter(data.title)}</Heading>
        <ul>
          {
            dataArray.map((d, i) => {
              return (<li key={`${d}${i + 1}`}>{SearchFormatter(d)}</li>);
            })
          }
        </ul>
        {
          activeShowAllBtn
            ? <Button
              className="linkBtn"
              onClick={this.showAllItems}
            >
              {SearchFormatter('Show All')}
            </Button>
            : null
        }
      </div>
    );
  }
}

export default SimpleListView;
