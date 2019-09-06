import config from 'config';

import {
  post,
} from './utils';

// import { generateElasticSearchUrl } from './search';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

// const searchTypeAheadFilters = [
//   'analysts.avatar_url',
//   'analysts.first_name',
//   'analysts.last_name',
//   'analysts.display_name',
//   'analysts.phone',
//   'analysts.email',
//   'analysts.sectors',
//   'analysts.position',
//   'analysts.division_name',
//   'analysts.display_title',
//   'analysts.role',
//   'analysts.do_not_sync_to_rds',
//   'analysts.roles',
//   'analysts.sequence',
//   'analysts.primary_indicator',
//   'analysts.active',
//   'analysts.client_code',
//   'analysts.person_id',
//   'publisher_date',
//   'title',
//   'bottom_line',
//   'company.ticker',
//   'company.name',
//   'company.active',
//   'company.domicile_country',
//   'template_name',
//   'product_id',
//   'tags',
//   'historical_publication',
//   'radar_link',
//   'summary',
//   'sector.ticker',
//   'sector.name',
//   'sector.symbol',
//   'dnd_portal',
//   'equity',
//   'corp_debt'
// ];

export async function getSearchResults(apiData, data) {
  let queryParams = {
    bool: {
      must: [
        (data.macro || ({ match_all: {} })),
        { ...(data.range) },
      ]
    }
  };
  if (data.bookmarkIds) {
    queryParams = {
      bool: {
        must: [
          { ...(data.bookmarkIds) },
          { ...(data.range) },
        ]
      }
    };
  }
  const query = {
    size: 20,
    from: (data.from || 0),
    sort: {
      [data.sortType]: data.sortOrder
    },
    query: queryParams
  };
  if (data.query) {
    query.query.bool.must.push(data.query);
  }
  if (data.locationFilters) {
    query.query.bool.must.push(data.locationFilters);
  }
  if (data.researchFilters) {
    query.query.bool.must.push(data.researchFilters);
  }
  if (data.additionalFilters) {
    query.query.bool.must.push(...(data.additionalFilters));
  }
  if (data.term) {
    query.query.bool.must.push(data.term);
  }
  if (window.unchainedSite && window.unchainedSite.sitename === 'Equity') {
    query.query.bool.must.push({ match: { equity: true } });
  } else {
    query.query.bool.must.push({ match: { corp_debt: true } });
    if (!data.includeEquity) {
      query.query.bool.must.push({ match: { equity: false } });
    }
  }
  query.query.bool.must.push({ match: { dnd_portal: false } });
  // const params = encodeURIComponent(JSON.stringify(query));
  // const filterPath = searchTypeAheadFilters.map(filter => `hits.hits._source.${filter}`).join(',');
  // const url = generateElasticSearchUrl({//eslint-disable-line
  //   base: 'publications/_search',
  //   query: `request_cache=false&filter_path=hits.hits._index,hits.total,${filterPath},hits.hits._id&source_content_type=application/json&source=${params}`
  // });

  return post(`${apiUrl}/library/getLibraryResults/`, apiData);
}
export async function getCorpPublication(apiData) {
  return post(`${apiUrl}/library/getLibraryResults/`, apiData);
}
export async function updateRebrandingIntroVisibilty() {
  return post(`${apiUrl}/user/update_rebranding_flag/`, {});
}

export async function getPodcastAnalystList() {
  let analystListQuery = {
    size: 500,
    sort: [
      {
        display_name: {
          order: 'asc'
        }
      },
    ],
  };
  analystListQuery = JSON.stringify(analystListQuery);
  const query = `{"index":"analysts"}\n${analystListQuery}\n`;
  const url = '/msearch/';
  return post(url, query);
}
