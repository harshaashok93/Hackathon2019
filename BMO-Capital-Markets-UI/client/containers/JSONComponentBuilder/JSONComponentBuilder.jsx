import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import { Message } from 'unchained-ui-react';

import {
  userSelector,
} from 'store/selectors';

class JSONComponentBuilder extends Component {
  props: {
    components: {},
    isAuthenticated: bool,
    jsonArray: [],
    profile: {},
  };

  buildSEOComponents = (seoObj = {}) => {
    return Object.keys(seoObj).map((k, i) => {
      const key = k.toLowerCase();
      const value = seoObj[k];

      if (key.indexOf('og') === 0) {
        const loopKey = i + 1;
        const property = key.replace(/(og)(.*)/, (originalStr, former, latter) => `${former}:${latter.toLowerCase()}`);
        return <meta key={loopKey} property={property} content={value} />;
      }

      let tag = null;

      switch (key) {
        case 'title':
          tag = <title key={Math.random()}>{value}</title>;
          break;
        case 'searchdescription':
          tag = <meta key={Math.random()} name={'description'} content={value} />;
          break;
        default:
          tag = <meta key={Math.random()} name={key} content={value} />;
          break;
      }

      return tag;
    });
  }

  buildChildComponents(data, canAccessContent) {
    const {
      children: jsonArray
    } = data;

    if (!jsonArray || jsonArray.length === 0) {
      return null;
    }

    return this.developComponents(jsonArray, canAccessContent);
  }

  whiteListArr = [
    'Header',
    'PageLogo',
    'HeroBannerWithAnalysts',
    'BlurredImageComponent',
    'Footer',
    'CookieAcknowledgementPopup',
    'WelcomePopupComponent',
  ];

  developComponents(jsonArray, canAccessContent) {
    const {
      components,
    } = this.props;

    return jsonArray.map((item) => {
      return Object.keys(item).map((componentName) => {
        if (componentName === 'seo') {
          return (
            <Helmet>
              {this.buildSEOComponents(item[componentName])}
            </Helmet>
          );
        } else if (componentName === 'page_parameters') {
          window.pageGlobalParams = {
            ...(item[componentName])
          };
          return null;
        }

        const Element = components[componentName];

        let accessContent = canAccessContent;


        if (this.whiteListArr.indexOf(componentName) > -1) {
          accessContent = true;
        }

        if (accessContent) {
          if (canAccessContent && componentName === 'BlurredImageComponent') return null;

          if (Element) {
            const children = this.buildChildComponents(item[componentName], accessContent);
            const props = JSON.parse(JSON.stringify(item[componentName]));
            delete props.children;

            if (props.wrapperComponent === true) {
              return children;
            }

            return <Element {...props}>{children}</Element>;
          }
          return (
            <Message
              warning
              header={'Component work in Progress'}
              content={`We are working hard at building ${componentName} component`}
            />
          );
        }
        return null;
      });
    });
  }

  render() {
    const {
      isAuthenticated,
      jsonArray,
      profile
    } = this.props;

    const { can_access_content } = profile; // eslint-disable-line
    let authenticationRequired = true;

    if (jsonArray && jsonArray.length) {
      try {
        authenticationRequired = jsonArray[0].page_parameters.authentication_required;
      } catch(e) {} // eslint-disable-line
    }
    let showComponent = false;

    if (authenticationRequired === false) {
      showComponent = true;
    } else if (can_access_content === true) { // eslint-disable-line
      showComponent = authenticationRequired ? isAuthenticated : !authenticationRequired;
    }
    return (
      <div>
        {this.developComponents(jsonArray, showComponent)}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: userSelector.getUserProfileInfo(state),
  isAuthenticated: userSelector.getIsLoggedIn(state),
});

export default connect(mapStateToProps)(JSONComponentBuilder);
