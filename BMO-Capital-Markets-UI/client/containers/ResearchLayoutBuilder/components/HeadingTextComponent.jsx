import React from 'react';
import PropTypes from 'prop-types';
import { RichText } from 'components';
import { Grid, Heading } from 'unchained-ui-react';
import SearchFormatter from './SearchFormatter';

const HeadingTextComponent = ({ data }) => {
  if (!data) return null;
  const heading = data.heading || '';
  let textContent = null;
  if (data.text && (data.text instanceof Array)) {
    textContent = data.text.map(text => {
      return (
        <RichText richText={SearchFormatter(text, { richText: false })} />
      );
    });
  } else if (data.text) {
    textContent = <RichText richText={SearchFormatter(data.text, { richText: false })} />;
  }
  return (
    <Grid className={'heading-text-component'}>
      <Grid.Column computer={12} tablet={12} mobile={12}>
        <Heading as={'h1'} content={SearchFormatter(heading)} />
        {textContent}
      </Grid.Column>
    </Grid>
  );
};

HeadingTextComponent.propTypes = {
  data: PropTypes.object
};

export default HeadingTextComponent;
