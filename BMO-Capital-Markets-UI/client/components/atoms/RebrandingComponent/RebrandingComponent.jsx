/* @flow weak */

/*
 * Component: RebrandingComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid, Button, Image } from 'unchained-ui-react';
import { tierImageMap } from 'constants/assets';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { RichText } from 'components';
import './RebrandingComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class RebrandingComponent extends Component {
  props: {
    data: [],
    title: '',
    updateRebrandingIntroVisibility: () => void,
    showRebrandingIntro: bool
  };

  render() {
    const { data, title, updateRebrandingIntroVisibility, showRebrandingIntro } = this.props;
    return (
      <div>
        { showRebrandingIntro ?
          (<Grid className="library-introduction">
            <Button className="ui button close-library-introduction bmo-close-btn bg-icon-props" onClick={() => updateRebrandingIntroVisibility()} />
            <Grid.Row className="category-container">
              <Grid.Column computer={3} tablet={12} mobile={12} className="library-introducing-category-info">
                {title}
              </Grid.Column>
              {data.map((item, i) => {
                return (
                  <Grid.Column className="introducing-category" computer={3} tablet={4} mobile={12} key={`${i + 1}`}>
                    <Grid.Row className="category-title">
                      <Image alt={'Brand-triabgle'} src={tierImageMap[item.IndividualRebrandingInfo.value]} className={'brand-triangle-icon'} />{item.IndividualRebrandingInfo.title}
                    </Grid.Row>
                    <Grid.Row className="category-description">
                      <RichText richText={item.IndividualRebrandingInfo.description} />
                    </Grid.Row>
                  </Grid.Column>
                );
              })}
            </Grid.Row>
          </Grid>) : null
        }
      </div>
    );
  }
}

export default RebrandingComponent;
