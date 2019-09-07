import React, { Component } from 'react';
import { Grid, Heading, Image } from 'unchained-ui-react';
import { RichText } from 'components';
import { Attachments } from 'containers/ResearchLayoutBuilder/components';
import { ResearchLayoutFilters } from 'containers';
import { getTriangleImage } from 'utils';
import { tierImageMap } from 'constants/assets';
import SearchFormatter from './SearchFormatter';
import StarRatings from 'react-star-ratings';
import {
  sendRatingStar,
} from 'api/research';

class MainContent extends Component {
  props: {
    data: {},
    pid: '',
    updateSearchTerm: () => void,
    isLoggedIn: bool,
    productId: '',
    type: '',
    tierMap: {},
    showAvailableOnlyInPDFMessage: bool,
  };

  static defaultProps = {
  };

  state = {
    fontSize: 'aa',
    rating: 0
  }

  updateFont = (fontSize) => {
    this.setState({ fontSize });
  }

  changeRating = (newRating) => {
    this.setState({ rating: newRating });
    sendRatingStar(newRating, this.props.productId);
  }

  render() {
    const { data, updateSearchTerm, isLoggedIn, pid, productId, type, tierMap, showAvailableOnlyInPDFMessage } = this.props;
    const { fontSize } = this.state;
    const showFilters = type !== 'packet';
    const triangleImage = getTriangleImage(tierMap);
    const bottomLineExists = data.bottomLine && data.bottomLine !== '';
    const keyPointsExists = data.keyPoints && data.keyPoints !== '';
    const summaryExists = data.summary && data.summary !== '';
    return (
      <Grid className={`main-content ${type !== 'packet' ? fontSize : ''}`}>
        {
          showFilters ?
            <Grid.Column computer={2} tablet={2} mobile={12} className="rl-filters-section">
              <ResearchLayoutFilters
                pid={pid}
                currentFontSize={fontSize}
                updateFontSize={(size) => this.updateFont(size)}
                handleSearchChange={(val) => updateSearchTerm(val)}
                productId={productId}
              />
            </Grid.Column>
            : null
        }
        <Grid.Column className="main-content-details" computer={showFilters ? 10 : 12} tablet={10} mobile={12}>
          {triangleImage ?
            <div className={'triangle-image'}>
              <Image alt={'Brand-triangle'} src={tierImageMap[triangleImage[0]]} className={'brand-triangle-licon'} />
              <span className={'brand-text'}>{triangleImage[1]}</span>
            </div>
            :
            null
          }
          { data.title && data.title !== '' && <div><Heading as={'h1'} id="intro-publication-title" content={SearchFormatter(data.title)} /><StarRatings
          rating={this.state.rating}
          starRatedColor='#1aab0d'
          starHoverColor='#b1b1b1'
          changeRating={this.changeRating}
          numberOfStars={5}
          name='rating'
          starDimension={'25px'}
        /></div> }
          { bottomLineExists ? <RichText richText={`<span class="bottomline-header">${SearchFormatter('Bottom Line: ', { richText: false })}</span><span class="bottomline-content">${SearchFormatter(data.bottomLine, { richText: false })}</span>`} /> : null }
          { keyPointsExists ? <Heading as={'h3'} className="keyPoints-header" content={SearchFormatter('Key Points')} /> : null }
          { keyPointsExists && <RichText className={'keypoints-content'} richText={SearchFormatter(data.keyPoints, { richText: false })} /> }
          { summaryExists ? <Heading as={'h3'} className="summary-header" content={SearchFormatter('Summary')} /> : null }
          { summaryExists && <RichText className={'summary-content'} richText={SearchFormatter(data.summary, { richText: false })} /> }

          { data.Attachments &&
            <Attachments
              data={data.Attachments}
              pid={pid}
              isLoggedIn={isLoggedIn}
              productId={productId}
              type={type}
              showAvailableOnlyInPDFMessage={showAvailableOnlyInPDFMessage}
            />
          }
        </Grid.Column>
      </Grid>
    );
  }
}

export default MainContent;
