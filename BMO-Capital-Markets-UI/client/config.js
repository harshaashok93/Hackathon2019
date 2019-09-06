import merge from 'lodash/merge';

const browser = typeof window !== 'undefined';

const config = {
  // defaults
  all: {
    env: process.env.HOST_ENV || 'local',
    publicPath: '/',
    apiUrl: '/',
    elasticSearchUrl: '/es-search',
    versionString: 'v0.0.1',
    apiVersion: 'api/v1',
    browser,
    analystURLPrefix: '/our-department/analysts'
  },
  // local overides, if any
  local: {
    apiUrl: 'https://bmo-capital-markets-dev-ui-equity.galepartners.com/api/v1',
    // apiUrl: 'http://192.168.3.147:8000/api/v1',
    elasticSearchUrl: 'https://bmo-capital-markets-osqa-ui-equity.galepartners.com/search',
    subDomain: window.location.hostname,
    ssoUrl: 'https://bmo-capital-markets-dev-ui-equity.galepartners.com/sso'
  },
  dev: {
    apiUrl: '/api/v1',
    mockApiUrl: '/mock-api',
    elasticSearchUrl: '/search',
    ssoUrl: '/sso'
  },
  qa: {
    apiUrl: '/api/v1',
    mockApiUrl: '/mock-api',
    elasticSearchUrl: '/search',
    ssoUrl: '/sso'
  },
  uat: {
    apiUrl: '/api/v1',
    mockApiUrl: '/mock-api',
    elasticSearchUrl: '/search',
    ssoUrl: '/sso'
  },
  prod: {
    apiUrl: '/api/v1',
    mockApiUrl: '/mock-api',
    elasticSearchUrl: '/search',
    ssoUrl: '/sso'
  }
};

module.exports = merge(config.all, config[config.all.env]);

export default module.exports;
