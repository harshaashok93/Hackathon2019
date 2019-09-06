import React, { Component } from 'react';

import { Button, Image, Label } from 'unchained-ui-react';

import { pushToDataLayer } from 'analytics';

class Sectors extends Component {
  props: {
    sectors: [],
    callback: () => void
  }

  state = {
    sectors: this.props.sectors
  }

  handleSectorSelection = (i) => {
    const { sectors } = this.state;
    const { callback } = this.props;
    const flag = !sectors[i].selected;

    sectors[i].selected = flag;
    callback(sectors[i].id, !flag);
    this.setState({ sectors });
  }

  componentDidMount() {
    pushToDataLayer('onboarding', 'sectorOverlay');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ sectors: nextProps.sectors });
  }

  render() {
    const { sectors } = this.state;
    return (
      <div className="sectors">
        {
          sectors.map((sector, i) => {
            return (
              <Button
                key={Math.random()}
                className={`${sector.selected ? 'background-circle' : 'background-circle-div '}`}
                onClick={() => this.handleSectorSelection(i)}
              >
                <Image src={`${sector.selected ? sector.hover_image : sector.image}`} />
                <Label>{sector.name}</Label>
              </Button>
            );
          })
        }
      </div>
    );
  }
}
export default Sectors;
