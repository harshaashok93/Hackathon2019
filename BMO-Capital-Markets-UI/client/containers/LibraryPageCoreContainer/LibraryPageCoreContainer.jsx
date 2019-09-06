/* @flow weak */

/*
 * Component: LibraryPageCoreContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Container, Sidebar, Menu } from 'unchained-ui-react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  LeftLayout,
  RightLayout,
  GICIcon,
  FilterComponent,
  SearchInputTextBox,
  PublicationSearchResult
} from 'components';
import './LibraryPageCoreContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LibraryPageCoreContainer extends Component {
  props: {
    // Prop types go here
  };

  static defaultProps = {
  };

  state = {
    mobileLayout: false,
  };

  componentDidMount() {
    // Component ready
  }

  handleClickEvent = (e) => {
    if (!(e.target.className === 'mobileBackDrop')) {
      return;
    }
    this.setState({ mobileLayout: false }, () => {
      document.body.removeEventListener('click', this.handleClickEvent);
    });
  }

  toggleleftLayoutClassName = () => () => {
    this.setState({ mobileLayout: !this.state.mobileLayout }, () => {
      document.body.addEventListener('click', this.handleClickEvent);
    });
  }

  render() {
    const logoData = { image: '/assets/images/gci_cards.png', title: 'Library' };
    return (
      <Container className="library-page-core-container">
        <LeftLayout>
          <GICIcon logoData={logoData} />
          <Container className={this.state.mobileLayout ? 'show-layout' : 'hide-layout'}>
            <Sidebar animation={'slide out'} className={'side-bar'} direction="left" as={Menu} visible={true} vertical >
              <FilterComponent />
            </Sidebar>
            <div className="mobileBackDrop" />
          </Container>
        </LeftLayout>
        <RightLayout>
          <SearchInputTextBox usingFor={'LibraryPage'} openFilter={this.toggleleftLayoutClassName()} />
          <PublicationSearchResult />;
        </RightLayout>
      </Container>
    );
  }
}

export default LibraryPageCoreContainer;
