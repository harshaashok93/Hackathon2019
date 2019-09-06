import { apiUrl } from 'config';
import { replaceOddCharactersToEven } from 'utils';
import moment from 'moment';
import { get, post } from './utils';

export function generateElasticSearchUrl({ base, params = '', query = '' }) {
  const url = `/${base}/${params}?${query}`;
  return url.replace(/(\/|\?)+$/, '');
}

// const getDefaultDateRange = () => {
//   let defaultDateRange = '24';
//   try {
//     defaultDateRange = window.unchainedSite && JSON.parse(window.unchainedSite.SearchDefaults.Library.content).date_field.toString();
//   } catch (e) {
//     console.error('getDefaultDateRange :: ' + e); // eslint-disable-line
//   }
//   return defaultDateRange;
// };


const isEquity = window.unchainedSite && window.unchainedSite.sitename === 'Equity';

let publicationQuery = '{"size":6,"_source":["title","dnd_portal","company.ticker","publisher_date","product_id","radar_link","historical_publication","multi_issuers"],"sort":[{"_score":"desc"},{"publisher_date":"desc"},{"title.raw":"asc"}],"query":{"bool":{"must":[{"range":{"publisher_date":{"gte":"now-1y/d","lte":"now"}}},{"bool":{"must_not":[{"match":{"dnd_portal":true}}]}},{"bool":{"should":[{"nested":{"path":"company","query":{"query_string":{"default_field":"company.ticker","query":"SEARCH_TERM","boost":10}}}},{"nested":{"path":"company","query":{"query_string":{"default_field":"company.actual_ticker","query":"SEARCH_TERM","boost":9}}}},{"nested":{"path":"company","query":{"query_string":{"default_field":"company.name_first_word","query":"SEARCH_TERM","boost":7}}}},{"nested":{"path":"sector","query":{"query_string":{"default_field":"sector.name_first_word","query":"SEARCH_TERM","boost":7}}}},{"nested":{"path":"company","query":{"query_string":{"default_field":"company.name","query":"SEARCH_TERM","boost":5}}}},{"nested":{"path":"sector","query":{"query_string":{"default_field":"sector.name","query":"SEARCH_TERM","boost":5}}}},{"query_string":{"default_field":"title","query":"SEARCH_TERM","boost":3}},{"query_string":{"default_field":"stripped_title","query":"SEARCH_TERM","boost":2}},{"query_string":{"default_field":"body","query":"SEARCH_TERM"}},{"nested":{"path":"analysts","query":{"query_string":{"default_field":"analysts.display_name","query":"SEARCH_TERM","type":"phrase","boost":10}}}},{"nested":{"path":"analysts","query":{"query_string":{"default_field":"analysts.display_name","query":"SEARCH_TERM","boost":7}}}},{"nested":{"path":"multi_issuers","query":{"query_string":{"default_field":"multi_issuers.ticker","query":"SEARCH_TERM","boost":10}}}},{"nested":{"path":"multi_issuers","query":{"query_string":{"default_field":"multi_issuers.name","query":"SEARCH_TERM","boost":5}}}},{"nested":{"path":"multi_issuers","query":{"query_string":{"default_field":"multi_issuers.short_name","query":"SEARCH_TERM","boost":7}}}}]}}]}}}';

let parsedQuery = JSON.parse(publicationQuery);
if (isEquity) {
  parsedQuery.query.bool.must.push({ match: { equity: true } });
} else {
  parsedQuery.query.bool.must.push({ match: { corp_debt: true } });
}

publicationQuery = JSON.stringify(parsedQuery);

let coverageQuery = {
  size: 4,
  _source: [
    'ticker',
    'name',
    'bm_sector_id',
    'active',
    'actual_ticker',
    'bm_sector_symbol',
    'company_id'
  ],
  sort: [
    {
      _score: 'desc'
    },
    {
      'name.raw': 'asc'
    }
  ],
  query: {
    bool: {
      must: [
        {
          bool: {
            must_not: [
              {
                match: {
                  active: false
                }
              },
              {
                match: {
                  hide: true
                }
              }
            ]
          }
        },
        {
          bool: {
            should: [
              {
                term: {
                  actual_ticker: {
                    value: 'SEARCH_TERM',
                    boost: 25
                  }
                }
              },
              {
                query_string: {
                  default_field: 'ticker',
                  query: 'SEARCH_TERM',
                  boost: 10
                }
              },
              {
                query_string: {
                  default_field: 'name_first_word',
                  query: 'SEARCH_TERM',
                  boost: 5
                }
              },
              {
                query_string: {
                  default_field: 'name',
                  query: 'SEARCH_TERM'
                }
              },
              {
                bool: {
                  must: [
                    {
                      nested: {
                        path: 'analysts',
                        query: {
                          query_string: {
                            default_field: 'analysts.display_name',
                            query: 'SEARCH_TERM',
                            boost: 4
                          }
                        }
                      }
                    },
                    {
                      nested: {
                        path: 'analysts',
                        query: {
                          term: {
                            'analysts.active': {
                              value: true
                            }
                          }
                        }
                      }
                    },
                    {
                      nested: {
                        path: 'analysts.roles',
                        query: {
                          query_string: {
                            default_field: 'analysts.roles.name',
                            query: 'ANALYST_ROLE_NAMES'
                          }
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
};

parsedQuery = coverageQuery;
if (isEquity) {
  parsedQuery.query.bool.must.push({ match: { corp_debt: false } });
} else {
  parsedQuery.query.bool.must.push({ match: { corp_debt: true } });
}

coverageQuery = JSON.stringify(parsedQuery);

let analystQuery = {
  size: 4,
  sort: [
    {
      _score: 'desc'
    },
    {
      'first_name.raw': 'asc'
    }
  ],
  _source: [
    'role',
    'display_name',
    'roles',
    'position',
    'client_code',
    'avatar_url',
    'division_name',
    'display_title',
    'person_id',
    'first_name',
    'last_name',
    'middle_name'
  ],
  query: {
    bool: {
      must: [
        {
          bool: {
            must_not: [
              {
                match: {
                  active: false
                }
              }
            ]
          }
        },
        {
          nested: {
            path: 'roles',
            query: {
              query_string: {
                query: 'ANALYST_ROLE_NAMES',
                default_field: 'roles.name'
              }
            }
          }
        },
        {
          bool: {
            should: [
              {
                nested: {
                  path: 'coverages',
                  query: {
                    bool: {
                      must: [
                        {
                          term: {
                            'coverages.active': true
                          }
                        },
                        {
                          query_string: {
                            default_field: 'coverages.ticker',
                            query: 'SEARCH_TERM',
                            boost: 10
                          }
                        }
                      ]
                    }
                  }
                }
              },
              {
                nested: {
                  path: 'coverages',
                  query: {
                    bool: {
                      must: [
                        {
                          term: {
                            'coverages.active': true
                          }
                        },
                        {
                          query_string: {
                            default_field: 'coverages.name_first_word',
                            query: 'SEARCH_TERM',
                            boost: 7
                          }
                        }
                      ]
                    }
                  }
                }
              },
              {
                nested: {
                  path: 'coverages',
                  query: {
                    bool: {
                      must: [
                        {
                          term: {
                            'coverages.active': true
                          }
                        },
                        {
                          query_string: {
                            default_field: 'coverages.name',
                            query: 'SEARCH_TERM',
                            boost: 5
                          }
                        }
                      ]
                    }
                  }
                }
              },
              {
                nested: {
                  path: 'sectors',
                  query: {
                    query_string: {
                      default_field: 'sectors.name_first_word',
                      query: 'SEARCH_TERM',
                      boost: 7
                    }
                  }
                }
              },
              {
                nested: {
                  path: 'sectors',
                  query: {
                    query_string: {
                      default_field: 'sectors.name',
                      query: 'SEARCH_TERM',
                      boost: 5
                    }
                  }
                }
              },
              {
                query_string: {
                  default_field: 'display_name',
                  query: 'SEARCH_TERM',
                  type: 'phrase',
                  boost: 20
                }
              },
              {
                match_phrase: {
                  display_name: {
                    query: 'SEARCH_TERM',
                    boost: 25
                  }
                }
              }
            ]
          }
        }
      ]
    }
  }
}; // eslint-disable-line

if (isEquity) {
  analystQuery.query.bool.must_not = [{
    nested: {
      path: 'roles',
      query: {
        query_string: {
          default_field: 'roles.name',
          query: '\"Debt Analyst\"' //eslint-disable-line
        }
      }
    }
  }];
}

analystQuery = JSON.stringify(analystQuery);

const mustNotQuery = [];
if (isEquity) {
  mustNotQuery.push({
    regexp: {
      name: {
        value: '.*~corporate'
      }
    }
  });
}

let sectorQuery = {
  size: 4,
  sort: [
    {
      _score: 'desc'
    },
    {
      'name.raw': 'asc'
    }
  ],
  _source: [
    'name',
    'bm_sector_id'
  ],
  query: {
    bool: {
      must: [
        {
          bool: {
            must_not: mustNotQuery,
            must: [
              {
                match: {
                  sector_or_periodical: 'sector'
                }
              }
            ]
          }
        },
        {
          bool: {
            should: [
              {
                query_string: {
                  default_field: 'name',
                  query: 'SEARCH_TERM',
                  boost: 10
                }
              },
              {
                query_string: {
                  default_field: 'name_first_word',
                  query: 'SEARCH_TERM',
                  boost: 5
                }
              },
              {
                match_phrase: {
                  name: {
                    query: 'SEARCH_TERM',
                    boost: 15
                  }
                }
              },
              {
                bool: {
                  must: [
                    {
                      nested: {
                        path: 'analysts',
                        query: {
                          query_string: {
                            default_field: 'analysts.display_name',
                            query: 'SEARCH_TERM',
                            type: 'phrase',
                            boost: 7
                          }
                        }
                      }
                    },
                    {
                      nested: {
                        path: 'analysts',
                        query: {
                          query_string: {
                            default_field: 'analysts.display_name',
                            query: 'SEARCH_TERM',
                            boost: 5
                          }
                        }
                      }
                    },
                    {
                      nested: {
                        path: 'analysts',
                        query: {
                          term: {
                            'analysts.active': {
                              value: true
                            }
                          }
                        }
                      }
                    },
                    {
                      nested: {
                        path: 'analysts.roles',
                        query: {
                          query_string: {
                            default_field: 'analysts.roles.name',
                            query: 'ANALYST_ROLE_NAMES'
                          }
                        }
                      }
                    }
                  ]
                }
              },
              {
                bool: {
                  must: [
                    {
                      bool: {
                        should: [
                          {
                            nested: {
                              path: 'coverages',
                              query: {
                                query_string: {
                                  default_field: 'coverages.ticker',
                                  query: 'SEARCH_TERM',
                                  boost: 7
                                }
                              }
                            }
                          },
                          {
                            nested: {
                              path: 'coverages',
                              query: {
                                query_string: {
                                  default_field: 'coverages.name_first_word',
                                  query: 'SEARCH_TERM',
                                  boost: 5
                                }
                              }
                            }
                          },
                          {
                            nested: {
                              path: 'coverages',
                              query: {
                                query_string: {
                                  default_field: 'coverages.name',
                                  query: 'SEARCH_TERM',
                                  boost: 1
                                }
                              }
                            }
                          },
                        ]
                      }
                    },
                    {
                      nested: {
                        path: 'coverages',
                        query: {
                          term: {
                            'coverages.active': true
                          }
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
};

parsedQuery = sectorQuery;
let ignoreSectors = [];
if (!isEquity) {
  ignoreSectors = ['Week in Review', 'BMO Research Today', 'The BMO RED - Real Estate Daily', 'BMO RED'];
}

ignoreSectors = ignoreSectors.map(sector => `"${sector}"`);
ignoreSectors = ignoreSectors.join(' OR ');
parsedQuery.query.bool.must[0].bool.must_not.push({ query_string: { default_field: 'name', query: ignoreSectors } });

sectorQuery = JSON.stringify(parsedQuery);

const query = `{"index":"publications"}\n${publicationQuery}\n{"index":"analysts"}\n${analystQuery}\n{"index":"coverages"}\n${coverageQuery}\n{"index":"sectors"}\n${sectorQuery}\n`;

export async function getSearchTypeaheadResults(term = '') {
  let escapedTerm = replaceOddCharactersToEven(term, '"');

  escapedTerm = escapedTerm.replace(/\\/g, '\\\\\\\\');
  escapedTerm = escapedTerm.replace(/"/g, '\\"');
  const specialChars = [
    '+',
    '-',
    '!',
    '(',
    ')',
    ':',
    '^',
    '[',
    ']',
    '~',
    '{',
    '}',
    '*',
    '?',
    '/'
  ];
  specialChars.map(char => {
    const regex = new RegExp(`(\\${char})`, 'g');
    escapedTerm = escapedTerm.replace(regex, '\\\\$1');
    return null;
  });

  // Constructing the Roles Query with all the Active roles in the DB.
  const siteName = (window.unchainedSite && window.unchainedSite.sitename && window.unchainedSite.sitename.toUpperCase()) || '';
  const roles = window.unchainedSite && window.unchainedSite.Roles && window.unchainedSite.Roles[siteName];
  const rolesQuery = roles.map(role => {
    return `\\"${role}\\"`;
  }).join(' OR ');

  const querySource = query.replace(/ANALYST_ROLE_NAMES/g, rolesQuery).replace(/SEARCH_TERM/g, (escapedTerm));

  const url = '/msearch/';

  return post(url, querySource);
}

export function setRecentSearch(data) {
  return post(`${apiUrl}/user/recent_search/`, data);
}

export function getMostOftenSearch() {
  return get(`${apiUrl}/user/getMostOftenSearch/?${moment.now()}`);
}

export async function searchBMOContacts(term = '') {
  // Ignoring the escaping of special characters as we will be doing a direct search only
  // let escapedTerm = replaceOddCharactersToEven(term, '"');

  // escapedTerm = escapedTerm.replace(/\\/g, '\\\\\\\\');
  // escapedTerm = escapedTerm.replace(/"/g, '\\"');
  // const specialChars = [
  //   '+',
  //   '-',
  //   '!',
  //   '(',
  //   ')',
  //   ':',
  //   '^',
  //   '[',
  //   ']',
  //   '~',
  //   '{',
  //   '}',
  //   '*',
  //   '?',
  //   '/'
  // ];
  // specialChars.map(char => {
  //   const regex = new RegExp(`(\\${char})`, 'g');
  //   escapedTerm = escapedTerm.replace(regex, '\\\\$1');
  //   return null;
  // });

  let bmoContactQuery = {
    size: 500,
    _source: [
      'first_name',
      'last_name'
    ],
    sort: [
      {
        'full_name.raw': {
          order: 'asc'
        }
      },
      {
        'email.raw': {
          order: 'asc'
        }
      }
    ],
    query: {
      bool: {
        should: [
          {
            match_phrase: {
              full_name: term
            }
          },
          {
            match_phrase: {
              email: term
            }
          }
        ]
      }
    }
  };

  bmoContactQuery = JSON.stringify(bmoContactQuery);

  const query = `{"index":"bmo_contact"}\n${bmoContactQuery}\n`;

  const url = '/msearch/';

  return post(url, query);
}

export async function searchCoverage(cusip, localTicker) {
  // Search API which returns the coverage based on CUSIP or the Ticker.
  let matchQuery = {};

  if (cusip) {
    matchQuery = { cusip };
  } else if (localTicker) {
    matchQuery = { actual_ticker: localTicker };
  }

  let coverageQuery = {
    _source: [
      'ticker',
      'bm_sector_symbol'
    ],
    query: {
      match: matchQuery
    }
  };

  coverageQuery = JSON.stringify(coverageQuery);

  const query = `{"index":"coverages"}\n${coverageQuery}\n`;

  const url = '/msearch/';

  return post(url, query);
}
