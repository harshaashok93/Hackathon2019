import React, { Component } from 'react';
import { Grid, Image, Label, Checkbox, Container } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';

class SubSectors extends Component {
  props: {
    subsectors: [],
    callback: () => void
  }

  static defaultProps = {
  };

  state = {
    subsectors: this.props.subsectors
  }

  subSectorSelections = [];
  subSectorSelectionNames = [];

  handleSubSectorSelection = (value, name) => (e, checkBox) => {
    const { callback } = this.props;
    const index = this.subSectorSelections.indexOf(value);
    const isChecked = !checkBox.checked;
    if (isChecked) {
      if (index === -1) return;
      this.subSectorSelections.splice(index, 1);
      this.subSectorSelectionNames.splice(index, 1);
    } else if (index === -1) {
      this.subSectorSelections.push(value);
      this.subSectorSelectionNames.push(name);
    }
    callback(Object.assign([], this.subSectorSelections), Object.assign([], this.subSectorSelectionNames));
  }

  componentDidMount() {
    pushToDataLayer('onboarding', 'subSectorOverlay');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ subsectors: nextProps.subsectors });
  }

  render() {
    const { subsectors } = this.state;
    if (!subsectors) return null;
    return (
      <div className="subsectors">
        {
          subsectors.map((subSector) => {
            return (
              <Grid computer={4} tablet={4} mobile={1} key={Math.random()}>
                <Grid.Column className="imageLabelSectionHolder" computer={3} tablet={4} mobile={12} >
                  <div className={'background-circle'}>
                    <Image src={`${subSector.hover_image}`} />
                  </div>
                  <Label>{subSector.name}</Label>
                </Grid.Column>
                {subSector.children &&
                  <Grid.Column computer={3} tablet={4} mobile={12}>
                    {
                      <Grid key={Math.random()}>
                        {
                          subSector.children.slice(0, 4).map(item => {
                            return (
                              <Container className="subSectorItem">
                                <Checkbox value={item.id} checked={this.subSectorSelections.indexOf(item.id) > -1} aria-label={item.name} onChange={this.handleSubSectorSelection(item.id, item.name)} />
                                <Label className="itemLabel">{item.name}</Label>
                              </Container>
                            );
                          })
                        }
                      </Grid>
                    }
                  </Grid.Column>
                }
                {(subSector.children && subSector.children.length > 4) &&
                  <Grid.Column computer={3} tablet={4} mobile={12}>
                    {
                      <Grid key={Math.random()}>
                        {
                          subSector.children.slice(4, 8).map(item => {
                            return (
                              <Container className="subSectorItem">
                                <Checkbox value={item.id} checked={this.subSectorSelections.indexOf(item.id) > -1} aria-label={item.name} onChange={this.handleSubSectorSelection(item.id, item.name)} />
                                <Label className="itemLabel">{item.name}</Label>
                              </Container>
                            );
                          })
                        }
                      </Grid>
                    }
                  </Grid.Column>
                }
                {(subSector.children && subSector.children.length > 8) &&
                  <Grid.Column computer={3} tablet={4} mobile={12}>
                    {
                      <Grid key={Math.random()}>
                        {
                          subSector.children.slice(8, 12).map(item => {
                            return (
                              <Container className="subSectorItem">
                                <Checkbox value={item.id} checked={this.subSectorSelections.indexOf(item.id) > -1} aria-label={item.name} onChange={this.handleSubSectorSelection(item.id, item.name)} />
                                <Label className="itemLabel">{item.name}</Label>
                              </Container>
                            );
                          })
                        }
                      </Grid>
                    }
                  </Grid.Column>
                }
              </Grid>
            );
          })
        }
      </div>
    );
  }
}

export default SubSectors;
